---
layout: post
title: The Interview
description:
img: /img/theInterview/theInterviewProject.png
---

<div class="img_row">
	<img class="col three" src="{{ site.baseurl }}/img/theInterview/theInterviewLandscape.png" alt="" title="Header"/>
</div>

<br>
<i>The interview is a quizz game where the player can choose ideas, rather than concrete answers, sort of defining the players ideosyncrasy.</i><br>
The original idea revolved around all the tricks an interviewer could play on its interviewee during a job interview.<br>

It all turned out rather morbid.<br>

Since the original idea implied dense dialog trees it was necessary to think of a tool for the job. I came across Inkle studio's <a href="https://www.inklestudios.com/ink/" target="_blank">ink</a>. It makes writting conversational games a breeze, thank you guys.
Once you have your ink script ready you just go through it like so:

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


In order to keep the art to a minimum, I made a simple shader to ease between sprites using <a href="http://amplify.pt/unity/amplify-shader-editor/" target="_blank">Amplify shader editor.</a> It allows to adjust the transition's progression with a float, and you can specify wether to ease in or out with another float.
Looks like this:

<div class="img_row">
	<img class="col three" src="{{ site.baseurl }}/img/theInterview/theInterviewShader.png" alt="" title="screenshot"/>
</div>
<br>
There are <i>4 possible endings</i>, depending on your attitud during the interview ( Spoiler, there aren't good endings ).

So put on you best shoes and <a class="gameLink" href="{{ site.baseurl }}/webgl/theInterview/index.html" target="_blank">give it a try.</a>

<div class="credits">
Original idea: <a href="https://paezpaez.com" target="_blank"> Israel Paez</a><br>
</div>

