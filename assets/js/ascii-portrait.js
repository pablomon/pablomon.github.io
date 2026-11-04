/*
 * ASCII portrait that gains detail as you zoom.
 *
 * The page ships a 50-row version inline (works without JS). When the
 * effective zoom (browser zoom x pinch zoom) makes characters look big,
 * this swaps in a higher-resolution version that keeps the same on-screen
 * size, so you see more characters instead of bigger, spread-out ones.
 *
 * Each file stores luminance as base-20 digits 0-9a-j (0 = darkest). Every
 * shade falls into a tier, and each cell shows a pseudo-random character from
 * its tier's set: wide capitals where it's darkest, then narrower capitals,
 * lowercase and punctuation. The choice depends only on the cell position, so
 * it is stable across re-renders. Shades are inverted for the dark theme.
 *
 * Keep TIERS and pick() in sync with the generator that writes the inline
 * version in about.md.
 *
 * Moving the pointer over the portrait scrambles the characters around it
 * (each flickers through random characters of its own tier, so the image stays
 * readable) and, when moving fast, knocks some loose so they fly off and fall.
 */
(function () {
  var box = document.querySelector(".aboutPhoto[data-ascii-base]");
  if (!box || !window.fetch) return;

  var SHADES = 20; // luminance levels stored in the files
  // [first shade NOT in this tier, characters]; lighter shades are blank
  var TIERS = [
    [4, "MWBQNHDGRO"],
    [8, "AEKPSUVXYZC"],
    [12, "abdeghknopqsuvxyz"],
    [15, ".,"]
  ];
  var LEVELS = [50, 75, 100, 150, 200]; // rows; 50 is the inline version
  var SIZE = 300;      // on-screen height in CSS px, the same for every level
  var TARGET = 12;     // ideal character height in device pixels
  var FONT = 12;       // render size before scaling (avoids minimum font sizes)
  var base = box.getAttribute("data-ascii-base");
  var root = document.documentElement;

  var cache = {};
  var current = LEVELS[0];
  var request = 0;
  var wrap = null;
  var live = null;

  function zoom() {
    var pinch = window.visualViewport ? window.visualViewport.scale : 1;
    return (window.devicePixelRatio || 1) * pinch;
  }

  function pickLevel() {
    var wanted = (SIZE * zoom()) / TARGET;
    var level = LEVELS[0];
    for (var i = 0; i < LEVELS.length; i++) {
      if (LEVELS[i] <= wanted) level = LEVELS[i];
    }
    return level;
  }

  // Cheap integer hash of a cell position -> stable pseudo-random character
  function pick(set, row, col) {
    var h = Math.imul(row + 1, 73856093) ^ Math.imul(col + 1, 19349663);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return set.charAt(((h ^ (h >>> 16)) >>> 0) % set.length);
  }

  function toChar(shade, row, col) {
    for (var t = 0; t < TIERS.length; t++) {
      if (shade < TIERS[t][0]) return pick(TIERS[t][1], row, col);
    }
    return " ";
  }

  function toText(grid) {
    var dark = root.getAttribute("data-theme") === "dark";
    return grid.split("\n").map(function (line, row) {
      return line.replace(/[0-9a-j]/g, function (d, col) {
        var i = parseInt(d, 20);
        return toChar(dark ? SHADES - 1 - i : i, row, col);
      });
    }).join("\n");
  }

  function ensureLive() {
    if (live) return;
    wrap = document.createElement("div");
    wrap.className = "ascii-live-wrap";
    live = document.createElement("pre");
    live.className = "ascii-portrait ascii-portrait-live";
    live.setAttribute("role", "img");
    live.setAttribute("aria-label", "ASCII art portrait of Pablo");
    wrap.appendChild(live);
    box.appendChild(wrap);
  }

  function render(level) {
    resetScramble();
    if (level === LEVELS[0]) {
      box.classList.remove("is-live");
      return;
    }
    ensureLive();
    live.textContent = toText(cache[level]);
    var scale = SIZE / (level * FONT);
    live.style.transform = "scale(" + scale + ")";
    box.classList.add("is-live");
    // Reserve the scaled size in the layout
    wrap.style.width = live.offsetWidth * scale + "px";
    wrap.style.height = SIZE + "px";
  }

  function update() {
    var level = pickLevel();
    if (level === current) return;
    current = level;
    if (level === LEVELS[0] || cache[level]) {
      render(level);
      return;
    }
    var token = ++request;
    fetch(base + "portrait-" + level + ".txt")
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (text) {
        cache[level] = text.replace(/\s+$/, "");
        if (token === request && current === level) render(level);
      })
      .catch(function () { /* keep whatever is showing */ });
  }

  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(update, 120);
  }

  window.addEventListener("resize", schedule);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", schedule);

  // Re-map characters when the theme toggle changes data-theme
  new MutationObserver(function () {
    resetScramble();
    if (current !== LEVELS[0] && cache[current]) render(current);
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // ---- Pointer interaction ------------------------------------------------
  //
  // Characters near the pointer flicker through random characters of their own
  // tier and settle back. Moving fast also knocks some of them loose: they fly
  // off in the direction of the movement, fall and fade, and the empty cell
  // flickers back to its character a moment later.

  var RADIUS = 56;          // px around the pointer that reacts
  var SETTLE_MIN = 250;     // ms a scrambled cell keeps flickering...
  var SETTLE_RANGE = 650;   // ...plus up to this much, at random
  var FLICKER = 0.35;       // chance per frame that a flickering cell changes
  var MIN_SPEED = 0.25;     // px/ms the pointer needs before characters fly off
  var MAX_PARTICLES = 220;
  var GRAVITY = 0.0016;     // px/ms^2
  var LIFE_MIN = 700;       // ms a flying character lives...
  var LIFE_RANGE = 700;     // ...plus up to this much
  var GAP_MIN = 600;        // ms a knocked-out cell stays empty...
  var GAP_RANGE = 600;      // ...plus up to this much

  var tierOf = {};
  TIERS.forEach(function (t) {
    for (var k = 0; k < t[1].length; k++) tierOf[t[1].charAt(k)] = t[1];
  });

  // { pre, orig: [lines], cells: [char arrays], cols,
  //   active: {"r,c": {empty: until-ms, until: until-ms}} }
  var scramble = null;
  var particles = [];
  var layer = null;
  var frame = 0;
  var last = null; // previous pointer sample, for the movement speed

  function visiblePre() {
    var pres = box.querySelectorAll("pre");
    for (var k = 0; k < pres.length; k++) {
      if (pres[k].getClientRects().length) return pres[k];
    }
    return null;
  }

  function resetScramble() {
    if (!scramble) return;
    scramble.pre.textContent = scramble.orig.join("\n");
    scramble = null;
  }

  function scrambleState() {
    var pre = visiblePre();
    if (!pre) return null;
    if (!scramble || scramble.pre !== pre) {
      resetScramble();
      var orig = pre.textContent.split("\n");
      scramble = {
        pre: pre,
        orig: orig,
        cells: orig.map(function (l) { return l.split(""); }),
        cols: Math.max.apply(null, orig.map(function (l) { return l.length; })),
        active: {}
      };
    }
    return scramble;
  }

  function randomFrom(set) {
    return set.charAt(Math.floor(Math.random() * set.length));
  }

  function ensureLayer() {
    if (layer) return;
    layer = document.createElement("div");
    layer.className = "ascii-particles";
    layer.setAttribute("aria-hidden", "true");
    box.appendChild(layer);
  }

  function launch(chr, x, y, size, vx, vy, now) {
    ensureLayer();
    var el = document.createElement("span");
    el.textContent = chr;
    el.style.fontSize = size + "px";
    el.style.lineHeight = size + "px";
    el.style.transform = "translate(" + x + "px," + y + "px)"; // start on its cell, not at 0,0
    layer.appendChild(el);
    particles.push({
      el: el, x: x, y: y,
      vx: vx * (0.5 + Math.random() * 0.7) + (Math.random() - 0.5) * 0.25,
      vy: vy * (0.5 + Math.random() * 0.7) - Math.random() * 0.25,
      rot: 0, spin: (Math.random() - 0.5) * 0.9,
      born: now, life: LIFE_MIN + Math.random() * LIFE_RANGE
    });
  }

  function onPointer(e) {
    var st = scrambleState();
    if (!st) return;
    var now = performance.now();

    // Pointer velocity (px/ms), clamped so a jump doesn't fire characters miles away
    var vx = 0, vy = 0;
    if (last && now - last.t < 100 && now > last.t) {
      vx = Math.max(-2.5, Math.min(2.5, (e.clientX - last.x) / (now - last.t)));
      vy = Math.max(-2.5, Math.min(2.5, (e.clientY - last.y) / (now - last.t)));
    }
    last = { x: e.clientX, y: e.clientY, t: now };
    var speed = Math.sqrt(vx * vx + vy * vy);
    // Chance that a character under the pointer is knocked loose
    var knock = speed > MIN_SPEED ? Math.min(0.5, (speed - MIN_SPEED) * 0.35) : 0;

    var rect = st.pre.getBoundingClientRect();
    var home = box.getBoundingClientRect();
    var rows = st.orig.length;
    var cw = rect.width / st.cols;
    var ch = rect.height / rows;
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var r0 = Math.max(0, Math.floor((y - RADIUS) / ch));
    var r1 = Math.min(rows - 1, Math.floor((y + RADIUS) / ch));
    var c0 = Math.max(0, Math.floor((x - RADIUS) / cw));
    var c1 = Math.min(st.cols - 1, Math.floor((x + RADIUS) / cw));
    for (var r = r0; r <= r1; r++) {
      for (var c = c0; c <= c1; c++) {
        var dx = (c + 0.5) * cw - x;
        var dy = (r + 0.5) * ch - y;
        var d2 = dx * dx + dy * dy;
        if (d2 > RADIUS * RADIUS) continue;
        var orig = st.orig[r].charAt(c);
        var set = tierOf[orig];
        if (!set) continue; // blank background stays blank
        var key = r + "," + c;
        var cell = st.active[key];
        if (cell && cell.empty > now) continue; // already knocked out

        // Closer to the pointer = more likely to fly
        if (knock && particles.length < MAX_PARTICLES &&
            Math.random() < knock * (1 - Math.sqrt(d2) / RADIUS)) {
          launch(st.cells[r][c], rect.left - home.left + c * cw, rect.top - home.top + r * ch, ch, vx, vy, now);
          var empty = now + GAP_MIN + Math.random() * GAP_RANGE;
          st.cells[r][c] = " ";
          st.active[key] = { empty: empty, until: empty + SETTLE_MIN };
        } else {
          st.cells[r][c] = randomFrom(set);
          st.active[key] = { empty: 0, until: now + SETTLE_MIN + Math.random() * SETTLE_RANGE };
        }
      }
    }
    draw();
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function draw() {
    scramble.pre.textContent = scramble.cells.map(function (l) { return l.join(""); }).join("\n");
  }

  var prevTick = 0;
  function tick(now) {
    frame = 0;
    var dt = prevTick ? Math.min(50, now - prevTick) : 16;
    prevTick = now;
    var any = false;

    var st = scramble;
    if (st) {
      var changed = false;
      for (var key in st.active) {
        var cell = st.active[key];
        var rc = key.split(",");
        var r = +rc[0], c = +rc[1];
        var orig = st.orig[r].charAt(c);
        if (now < cell.empty) {
          any = true;
        } else if (now < cell.until) {
          any = true;
          if (st.cells[r][c] === " " || Math.random() < FLICKER) {
            st.cells[r][c] = randomFrom(tierOf[orig]);
            changed = true;
          }
        } else {
          st.cells[r][c] = orig;
          delete st.active[key];
          changed = true;
        }
      }
      if (changed) draw();
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      var age = now - p.born;
      if (age >= p.life) {
        p.el.remove();
        particles.splice(i, 1);
        continue;
      }
      p.vy += GRAVITY * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      p.el.style.transform = "translate(" + p.x + "px," + p.y + "px) rotate(" + p.rot + "deg)";
      p.el.style.opacity = String(Math.min(1, 2 * (1 - age / p.life)));
    }
    if (particles.length) any = true;

    if (any) frame = requestAnimationFrame(tick);
    else prevTick = 0;
  }

  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!calm) box.addEventListener("pointermove", onPointer);

  current = null;
  update();
})();
