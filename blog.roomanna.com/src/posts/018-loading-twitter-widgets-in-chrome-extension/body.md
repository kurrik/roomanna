[1]: https://twitter.com/about/resources/buttons#tweet
[2]: https://twitter.com/settings/widgets
[3]: {{link "003-getting-an-extensions-id"}}
[4]: http://developer.apple.com/library/safari/#documentation/Tools/Conceptual/SafariExtensionGuide/MessagesandProxies/MessagesandProxies.html#//apple_ref/doc/uid/TP40009977-CH14-SW9

Twitter's Javascript-based third party offerings include [buttons][1] and
[embedded content][2], which are handy for putting Twitter content into your
website.  Unfortunately, they break when included in a Chrome extension, due
to the use of protocol-relative URLs.  Luckily there's a way to fix the
problem, although it requires a bit of extra code.

<!--BREAK-->

There are two concepts fundamental to this problem.  The first is the
Chrome extension resource address format.  For example, if you have a
file <tt>index.html</tt> in your chrome extension, Chrome gives it the address
of <tt>chrome-extension://foobarbaz/index.html</tt>, where `foobarbaz` is
an [ID number][3] unique to your extension.  This address works pretty much
like a standard URL - if you were to have a relative link to <tt>bar.html</tt>
in <tt>index.html</tt>, it would resolve to
<tt>chrome-extension://foobarbaz/bar.html</tt>.

The second concept is that of the protocol-relative URL.  This is a
mechanism which allows you to specify an URL which inherits its protocol
from the current page.  For example, if you were to include
`<script src="//example.com/javascript.js"></script>`
in a page loaded via HTTPS, then the browser would load
<tt>https://example.com/javascript.js</tt>.  In a page loaded via HTTP,
the browser would load <tt>http://example.com/javascript.js</tt>.

The issue, therefore, is that Twitter's widgets code relies on
protocol-relative URLs to load the JavaScript which delivers all the
goodies.  For example, this code:

<pre>
&lt;a href="https://twitter.com/share" class="twitter-share-button" data-via="kurrik"&gt;Tweet&lt;/a&gt;
&lt;script&gt;!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");&lt;/script&gt;
</pre>

Will attempt to load <tt>chrome-extension://platform.twitter.com/widgets.js</tt>
when included in a Chrome extension.  Naturally this won't resolve.
The obvious workaround is to hardcode
<tt>https://platform.twitter.com/widgets.js</tt> into your script include,
but that script includes additional resources in a protocol-relative
format, so the breakage just occurs further down the line.

Luckily there's a WebKit DOM event called `beforeload` which allows pages
to block or modify requests they make.  It's a bit thinly
documented - see "blocking unwanted content" [here][4].  It's
pretty easy to implement though - listen for the event on the page, find events
which match the appropriate <tt>chrome-extension://</tt> URLs, then stop
the event and rewrite the URLs being loaded.  Just make sure to set this
up before including the <tt>widgets.js</tt> script and you should get
the events without a problem:

<pre>
rewrites = [
  [/chrome-extension:\/\/([a-z]+)\.twitter\.com/, 'https://$1.twitter.com'],
  [/chrome-extension:\/\/([a-z]+)\.twimg\.com/, 'https://$1.twimg.com']
];

document.addEventListener('beforeload', function(e){
  for (var i = 0, rule; rule = rewrites[i]; i++) {
    if (rule[0].test(e.url)) {
      e.preventDefault();
      e.stopPropagation();
      e.srcElement.src = e.srcElement.src.replace(rule[0], rule[1]);
      break;
    }
  }
}, true);
</pre>

Make sure you don't forget to change your <tt>widgets.js</tt> include
to reference the HTTPS file.  Don't be tempted to use HTTP, either.
Since Chrome extensions have
privileged access to your browser, it's rather important to only
load HTTPS resources:

<pre>
&lt;script&gt;!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="<strong>https://</strong>platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");&lt;/script&gt;
</pre>

Finally, the new changes to Chrome Extension security require the use of
a Content Security Policy directive to allow third-party components to
be embedded in an extension page.  You'll need to make sure your manifest
contains the following (I've wrapped it for legibility but this should all
be on a single line in your manifest):

<pre>
"content_security_policy":
  "script-src 'self'
              https://platform.twitter.com
              https://cdn.api.twitter.com
              https://syndication.twimg.com;
   object-src 'self'",
</pre>

You may need to amend this if you include resources from elsewhere on the
web.

I'll note that this technique will be generally applicable for any
third-party Javascript libraries which use protocol-relative URLs.
It may help open up a lot of new functionality for Chrome extensions.
