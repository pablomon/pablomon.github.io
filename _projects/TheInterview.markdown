---
layout: post
slug: the-interview  # URL: /games/the-interview/
title: The Interview
description:
img: /img/the-interview/the-interview-project.png
accent: "#6e82f7"  # neon colour for the games grid, taken from the cover
genre: Narrative quiz
tagline: A quiz game where the player chooses ideas, rather than concrete answers, sort of defining their idiosyncrasy.
hero: /img/the-interview/the-interview-landscape.png
play: /webgl/the-interview/index.html
---

<div class="prose">
	<p>The original idea revolved around all the tricks an interviewer could play on their interviewee during a job interview.</p>
	<p>It all turned out rather morbid.</p>
	<p>Since the original idea implied dense dialog trees, it was necessary to think of a tool for the job. I came across Inkle Studios' <a href="https://www.inklestudios.com/ink/" target="_blank" rel="noopener">ink</a>. It makes writing conversational games a breeze, thank you guys. Once you have your ink script ready, you just go through it like so:</p>

{% highlight c# %}
[SerializeField] private TextAsset inkScript;
private Story story;
...
story = new Story(inkScript.text);
...
string text = string.Empty;
while (story.canContinue)
{
    text += story.Continue().Trim();
    text += "\n";
}
{% endhighlight %}

	<p>In order to keep the art to a minimum, I made a simple shader to ease between sprites using <a href="http://amplify.pt/unity/amplify-shader-editor/" target="_blank" rel="noopener">Amplify Shader Editor</a>. It allows you to adjust the transition's progression with a float, and to specify whether to ease in or out with another float. It looks like this:</p>
</div>

<figure>
	<img src="{{ site.baseurl }}/img/the-interview/the-interview-shader.png" alt="Sprite transition shader graph"/>
	<figcaption>Sprite transition shader in Amplify Shader Editor</figcaption>
</figure>

<div class="prose">
	<p>There are <em>4 possible endings</em>, depending on your attitude during the interview (spoiler: there aren't any good endings).</p>
	<p>So put on your best shoes and <a href="{{ site.baseurl }}/webgl/the-interview/index.html" target="_blank" rel="noopener">give it a try</a>.</p>
</div>
