---
layout: post
title: The Interview
description:
img: /img/theInterview/theInterviewProject.png
---

<div class="img_row">
	<img class="col three" src="{{ site.baseurl }}/img/theInterview/theInterviewLandscape.png" alt="" title="Header"/>
</div>

The original idea revolved around all the tricks an interviewer could play on its interviewee during a long job interview. Lots of questions and answers.
So "The interview" is it's prototype.<br>

The result is a short quizz where the player can choose ideas, rather than concrete answers, sort of defining the interviewee's ideosyncrasy.
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

There are 4 possible endings, depending on your attitud during the interview ( There aren't good endings, just better ones ).

So put on you best shoes and <a href="{{ site.baseurl }}/webgl/theInterview/index.html" target="_blank">give it a try.</a>

<div class="credits">
Idea: <a href="https://paezpaez.com" target="_blank"> Israel Paez</a><br>
Art: Pablo Monteserín<br>
Code: Pablo Monteserin<br>
</div>

