---
layout: post
title: Space talker
description:
img: /img/spaceTalker/spaceTalkerProject.png
---

A tiny project I did to play around with some techniques using Scriptable Objects I learnt from watching some talks on the matter. <br>

Equally great, these two talks will not only teach you about Scriptable objects but they provide some insight on how Unity works under the hood. There is a lot to take away from them. <br>

<a href = "https://www.youtube.com/watch?v=6vmRwLYWNRo" target="_blank"> Richard Fine's talk. </a> <br>
<a href = "https://www.youtube.com/watch?v=raQ3iHhE_Kk" target="_blank"> Ryan Hipple's talk. </a> <br>

I used Scriptable Objects to create a game event system that allows decoupling game objects from themselves and even from the scene. This design pattern works natively in Unity through the inspector. Drag and drop the GameEvent asset a game object listens to and forget about who is raising it.

<div class="img_row">
	<img class="col two" src="{{ site.baseurl }}/img/spaceTalker/spaceTalker3.png" alt="" title="Android screenshot"/>
	<img class="col one" src="{{ site.baseurl }}/img/spaceTalker/spaceTalker2.png" alt="" title="Unity editor"/>
</div>
<br>

The art style is heavily inspired on the works of Pedro Medeiros, whom you can follow on his <a href="https://www.patreon.com/saint11" target="_blank"> Pantreon </a>.
<br>
<br>
In order to make the pilot convey some feelings, the direction it looks towards varies acording to the emotion the dialog carries. Internal dialog down left, visual imagination up left, visual memory up right.

<a href="{{ site.baseurl }}/webgl/spaceTalker/index.html" target="_blank">Take a look</a>.

<div class="credits">
Idea: Pablo Monteserín<br>
Art: Pablo Monteserín<br>
Code: Pablo Monteserin<br>
</div>