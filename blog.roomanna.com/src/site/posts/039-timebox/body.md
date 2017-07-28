This is the post snippet.

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

<div id="example01"></div>
{{template "image" (yamltemplate "imagedata").monthly_impressions}}
{{template "image" (yamltemplate "imagedata").tweet_alltime_impressions}}
{{template "image" (yamltemplate "imagedata").tweet_monthly_impressions}}
<div id="example02"></div>
<div id="example03"></div>
