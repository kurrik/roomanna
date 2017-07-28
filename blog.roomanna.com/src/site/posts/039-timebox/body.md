When I was first starting up at Stripe, I wound up having a few conversations
about my time at Twitter.  Aside from all the organizational drama at that
company, I generally found myself explaining that it was a really great
environment to learn about nuances of product design.

I generally used the example of
[analytics.twitter.com](https://analytics.twitter.com).  Superficially, this
site has a very direct purpose--to show you numbers associated with your
Tweets.  But as we started exploring a landing page which would show
aggregated impressions, we found all sorts of cases which would surprise
our customers.

<!--BREAK-->

This is content after the break.

{{define "imagedata"}}
monthly_impressions:
  Image: {{imagemeta "monthly-impressions.png" | tojson}}
  Alt: "Monthly impression counts"
tweet_alltime_impressions:
  Image: {{imagemeta "tweet-alltime-impressions.png" | tojson}}
  Alt: "Alltime impression counts for a single Tweet"
tweet_monthly_impressions:
  Image: {{imagemeta "tweet-monthly-impressions.png" | tojson}}
  Alt: "Monthly impression counts for a single Tweet"
{{end}}

{{define "image"}}
  <p class="centered"><img style="width:50%;height:50%" width="{{.Image.Width}}" height="{{.Image.Height}}" src="{{.Image.Path}}" alt="{{.Alt}}" /></p>
{{end}}

<div id="example00"></div>

<div id="example01"></div>
{{template "image" (yamltemplate "imagedata").monthly_impressions}}
<div id="example02"></div>
{{template "image" (yamltemplate "imagedata").tweet_alltime_impressions}}
<div id="example03"></div>
{{template "image" (yamltemplate "imagedata").tweet_monthly_impressions}}

