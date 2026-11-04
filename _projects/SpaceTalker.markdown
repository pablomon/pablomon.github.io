---
layout: post
title: Space talker
description:
img: /img/spaceTalker/spaceTalkerProject.png
accent: "#e8e8e8"  # neon colour for the games grid, taken from the cover
genre: Tech demo
tagline: A tiny project to play around with Scriptable Objects in Unity.
play: /webgl/spaceTalker/index.html
---

<div class="prose">
	<p>A tiny project I did to play around with some techniques using Scriptable Objects that I learnt from watching some talks on the matter.</p>
	<p>Equally great, these two talks will not only teach you about Scriptable Objects, but also provide some insight into how Unity works under the hood. There is a lot to take away from them:</p>
	<ul class="feature-list">
		<li><a href="https://www.youtube.com/watch?v=6vmRwLYWNRo" target="_blank" rel="noopener">Richard Fine's talk</a></li>
		<li><a href="https://www.youtube.com/watch?v=raQ3iHhE_Kk" target="_blank" rel="noopener">Ryan Hipple's talk</a></li>
	</ul>
	<p>I used Scriptable Objects to create a game event system that decouples game objects from each other and even from the scene. This design pattern works natively in Unity through the inspector: drag and drop the GameEvent asset a game object listens to, and forget about who is raising it.</p>
</div>

<div class="gallery gallery-2-1">
	<figure>
		<img src="{{ site.baseurl }}/img/spaceTalker/spaceTalker3.png" alt="Space Talker running on Android"/>
		<figcaption>Android screenshot</figcaption>
	</figure>
	<figure>
		<img src="{{ site.baseurl }}/img/spaceTalker/spaceTalker2.png" alt="Space Talker in the Unity editor"/>
		<figcaption>Unity editor</figcaption>
	</figure>
</div>

<div class="prose">
	<p>The art style is heavily inspired by the work of Pedro Medeiros, whom you can follow on his <a href="https://www.patreon.com/saint11" target="_blank" rel="noopener">Patreon</a>.</p>
	<p>In order to make the pilot convey some feelings, the direction it looks towards varies according to the emotion the dialog carries: internal dialog down left, visual imagination up left, visual memory up right.</p>
</div>
