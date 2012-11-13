[1]: https://chrome.google.com/webstore/detail/jlncmhmfcecpdddbiikdagcnhjlmnoib
[2]: {{link "twitterbars.png"}}
[3]: {{link "012-my-first-weeks-at-twitter"}}
[4]: https://dev.twitter.com
[5]: http://code.google.com/chrome/extensions/content_scripts.html
[6]: {{link "twitterbars2.png"}}
[7]: http://www.chromium.org/developers/design-documents/user-scripts
[8]: http://www.w3.org/TR/2dcontext/#dom-context-2d-globalcompositeoperation
[9]: {{link "favicon1.png"}}
[10]: {{link "favicon2.png"}}
[11]: {{link "favicon3.png"}}

Since [starting my job at Twitter][3], I've spent a *lot* of time on
[dev.twitter.com][4], either reading documentation or posting on the discussion
group.  I've also been Tweeting a lot more, and I tend to switch back and forth
a lot throughout the work day.  My browsing habits tend to lead to a
bunch of open tabs in Chrome, and I realized that I was
losing productivity.

<!--BREAK-->

To illustrate, quickly tell me which of
the following tabs is for **twitter.com**, and which are **dev.twitter.com**:

![2]

Not very easy, huh?

So I did what I always do in this case - turned to my good friend, the [Chrome
Extension content script][5].  Using some Javascript,
the <code>&lt;link rel="icon"&gt;</code> element, and the HTML5 canvas
API, I was able to quickly turn the tab strip into this:

![6]

Much better!  And the technique is general-purpose enough to be used on any
domain, or even in a non-Chrome extension context (if you can run code on the
target domain, that is).  The extension itself can be found [in the Chrome
Web Store][1].  Read on for a walkthrough of the code.

## Boilerplate

I could've written this as a [user script][7], but I like hosting stuff in the
Chrome Web Store, so I decided to do a full-on packaged extension.  So I made
a simple **manifest.json** file:

<pre class="brush: javascript">
{
   "name": "Change favicon for dev.twitter.com",
   "description": "Make dev.twitter.com stand out from twitter.com",
   "version": "1.0.0",
   "content_scripts": [ {
      "js": [ "favicon.js" ],
      "matches": [ "https://dev.twitter.com/*" ],
      "run_at": "document_idle"
   } ]
}
</pre>
<!-- _end italics -->

The only thing truly important to note here is that I specified a content script
which executes a file named **favicon.js** any time Chrome visits an URL matching
<code>https://dev.twitter.com</code>. If you are planning on adapting this
script to a different domain, this is where you would configure where the script
runs.

## Content script

The actual meat of the script lives in **favicon.js** and runs in the context of
the target page.  It does the following:

1. Gets or creates a `<link rel="icon">` element to render the favicon.
1. Loads the page's favicon and draws it into a canvas.
1. Recolors the image drawn into the canvas.
1. Sets the link element's href to point to the canvas data.

### Link element

A `<link rel="icon">` (many sites use "shortcut icon" but Chrome only needs
to use "icon" as the link type) element can set the favicon for a given page.
While **dev.twitter.com**
contains such a link element in the DOM, not every page does, so the following
code queries for such an element and creates one if nothing is found:

<pre class="brush:javascript">
var link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement("link");
  link.setAttribute("rel", "icon");
  document.head.appendChild(link);
}
</pre>

### Get the favicon

Now that the code has a handle to an appropriate link element, it
loads the existing favicon into a `<canvas>`.  In the case of
**dev.twitter.com**,
the favicon's URL can be found as the `href` of the link element located by
the previous snippet of code.

For a more general-purpose script, a given page is not guaranteed to have a
`<link rel="icon">` element, but since favicons live in canonical
locations, it is possible to guess the favicon URL from the page's origin:

<pre class="brush:javascript">
var faviconUrl = link.href || window.location.origin + "/favicon.ico";
</pre>

<div class="alert">
<strong>Note:</strong> Because the content script is going to be manipulating
the pixels of the favicon using a canvas, the favicon <em>must</em>
be hosted on the same domain as the current page.  Unfortunately,
some sites redirect their favicons to a different domain, for example
<code>http://news.ycombinator.com/&#8203;favicon.ico</code> actually
redirects to <code>http://ycombinator.com/&#8203;favicon.ico</code>.
See <a href="#extending">below</a> for a way to address this problem.</div>

The image pointed to by this URL needs to be drawn to a canvas, but there is
no canvas `drawImage` API which will take an URL as a parameter.  Thankfully,
HTML `<img>` elements act as a good proxy between URLs and canvas elements.

First, load the URL is loaded into an image tag:

<pre class="brush: javascript">
function onImageLoaded() {
  ...
};
var img = document.createElement("img");
img.addEventListener("load", onImageLoaded);
img.src = faviconUrl;
</pre>

Then, the image element is drawn to a new canvas:

<pre class="brush: javascript">
function onImageLoaded() {
  var canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
};
</pre>

Even though the canvas isn't really placed in the DOM anywhere, this is what it
would look like if it were visible:

![9]

I've enlarged the image 20x and changed the alpha channel to show pink instead
of transparency.

### Recolor the drawn image

Once the favicon is loaded in a canvas element, any number of modifications
are possible.  Personally, I preferred to use the fairly new
[`globalCompositeOperation`][8] 2d context attribute to recolor the image.
Here's an implementation:

<pre class="brush: javascript">
function onImageLoaded() {
  var canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
  context.globalCompositeOperation = "source-in";
  context.fillStyle = "#d00";
  context.fillRect(0, 0, 16, 16);
  context.fill();
};
</pre>

This `onImageLoaded` function:

1. Draws the existing favicon to the canvas.
1. Sets the canvas composite mode to `source-in`.
1. Draws a 16x16x rectangle in <span style="color:#d00">a reddish color</span>
   on top of everything in the canvas.

The significance of the `source-in` parameter is that it defines how canvas
operations affect the content already drawn onto the canvas.  The default,
`source-over`, instructs the canvas implementation to:

<blockquote>
Display the source image wherever the source image is opaque. Display the
destination image elsewhere.
</blockquote>

Which is just a fancy way of saying "draw over the existing
image".  By changing this value to `source-in`, the implementation will:

<blockquote>
Display the source image wherever both the source image and destination
image are opaque. Display transparency elsewhere.
</blockquote>

This means that the layer to be drawn will only be drawn where the
current canvas is opaque, so if the canvas contains the original favicon,
and a 16x16 red square is drawn over it:

<div class="inline center">
  <img src="{{link "favicon1.png"}}" style="width: 240px" />
  <img src="{{link "favicon2.png"}}" style="width: 240px" />
</div>

The result will be a solid red image, but with an alpha channel matching the
original favicon:

![11]

### Setting the favicon

This image exists in memory, but needs to be pointed at by an URL so that
the `<link>` element can reference it.  Due to the small size of a favicon,
this is an ideal use for a data URL.  If you're not familiar with the way
data URLs work, they encode the contents of an entire file into a string which
may be used anywhere an URL would be accepted.

For example. if you paste the following string into the browser's address bar,
you'll see the modified Twitter favicon:

<blockquote><code>
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAA&#8203;
ABZ0lEQVQ4T6WTvUsDQRDF32mh2NiKIKIG65QWFtFGFEELC8tUFum1DQRRbATRXjvFJq&#8203;
iVphD/A0vBj2ghxCoRRGz8+E24Xe7CXQzkYNjZt2/ezOzsBeryC7qMV8cCD1Ie8pglnJ&#8203;
CKLnFT4Eka/ZUaHLwnVfQoHYLn4Xyw7mSkzZgAhEWAC6wM6RzCkSOEmU3Afz1SjlJuDP&#8203;
AV/EglNitgA1gd27dSEXgFH26p7IqzOS9gDlVMs1Sw/gj5Fj+b0NYnVSx8cyf+EhEYZF&#8203;
OihbUWkaRrcVgxNgVEJhEoA47/I2ItNuBWYgL3Uh/AModboUha9hOCL3ulakDWXch7pH&#8203;
xxbLBj/NWU6Dr9zzIFux+ZQIF1w27e3gJiuTZNf8E5YMzrjhNUpSFGaI9kieCpNsE1zk&#8203;
+xbbLXvIA5Ye/zlDaDkI1txBHYv+Fbe9f0fBYNbrYQzWijRCRr83U4QZbtGeAuqbqOf6&#8203;
a01v4AkvBSO+ESsK0AAAAASUVORK5CYII=
</code></blockquote>

(Or just click <a target="_blank" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZ0lEQVQ4T6WTvUsDQRDF32mh2NiKIKIG65QWFtFGFEELC8tUFum1DQRRbATRXjvFJqiVphD/A0vBj2ghxCoRRGz8+E24Xe7CXQzkYNjZt2/ezOzsBeryC7qMV8cCD1Ie8pglnJCKLnFT4Eka/ZUaHLwnVfQoHYLn4Xyw7mSkzZgAhEWAC6wM6RzCkSOEmU3Afz1SjlJuDPAV/EglNitgA1gd27dSEXgFH26p7IqzOS9gDlVMs1Sw/gj5Fj+b0NYnVSx8cyf+EhEYZFOihbUWkaRrcVgxNgVEJhEoA47/I2ItNuBWYgL3Uh/AModboUha9hOCL3ulakDWXch7pHxxbLBj/NWU6Dr9zzIFux+ZQIF1w27e3gJiuTZNf8E5YMzrjhNUpSFGaI9kieCpNsE1zk+xbbLXvIA5Ye/zlDaDkI1txBHYv+Fbe9f0fBYNbrYQzWijRCRr83U4QZbtGeAuqbqOf6a01v4AkvBSO+ESsK0AAAAASUVORK5CYII=">here</a>)

It is possible to get the data URL corresponding to a canvas by calling
`toDataURL()` on the canvas element.  The modified `onImageLoaded` function
only needs two additional lines:

<pre class="brush: javascript">
function onImageLoaded() {
  var canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
  context.globalCompositeOperation = "source-in";
  context.fillStyle = "#d00";
  context.fillRect(0, 0, 16, 16);
  context.fill();
  link.type = "image/x-icon";
  link.href = canvas.toDataURL();
};
</pre>

To be honest, I'm not completely sure why Chrome needs the `image/x-icon` type,
but some pages won't render correctly unless this attribute is explicitly set.

A complete **favicon.js** looks like this:

<pre class="brush: javascript">
/*
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement("link");
  link.setAttribute("rel", "shortcut icon");
  document.head.appendChild(link);
}
var faviconUrl = link.href || window.location.origin + "/favicon.ico";
function onImageLoaded() {
  var canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
  context.globalCompositeOperation = "source-in";
  context.fillStyle = "#d00";
  context.fillRect(0, 0, 16, 16);
  context.fill();
  link.type = "image/x-icon";
  link.href = canvas.toDataURL();
};
var img = document.createElement("img");
img.addEventListener("load", onImageLoaded);
img.src = faviconUrl;
</pre>

<div id="extending"></div>
## Making the extension work on all domains

The above content script works pretty well on the vast majority of sites I've
tested.  If you want to implement this technique for a specific set of sites
and it works on all of them, I recommend using that approach.

For a small set of sites, however, a `Uncaught Error: SECURITY_ERR:
DOM Exception 18` message will be displayed in the console.  This is because
these sites load a cross-domain favicon, setting the canvas' *origin-clean*
flag to false and disabling the `toDataURL` function.

Luckily, there's a reliable way to get favicon data from a Chrome extension.
Extensions may request the `chrome://favicon` permission, which allows
them to reference URLs like `chrome://favicon/https://twitter.com` from
extension pages.  The downside to this is that this permission doesn't extend
to content scripts, meaning that an extension which uses this pretty much needs
to have a background page.  The upside is that this approach works on every
domain I've tested.

Adding the appropriate permissions and background page to **manifest.json**
results in:

<pre class="brush: javascript">
{
   "name": "Change all favicons",
   "description": "Make every favicon red",
   "version": "1.0.0",
   "content_scripts": [ {
      "js": [ "favicon.js" ],
      "matches": [ "&lt;all_urls&gt;" ],
      "run_at": "document_idle"
   } ],
  "permissions": ["chrome://favicon/"],
  "background_page": "background.html"
}
</pre>
<!-- _end italics -->

Most of the work is now offloaded into a message handler in the new
**background.html** page:

<pre class="brush: html">
&lt;!DOCTYPE html&gt;
&lt;!--
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
--&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;script&gt;
      function getFavicon(request, sender, callback) {
        var faviconUrl = 'chrome://favicon/' + request.url;
        function onImageLoaded() {
          var canvas = document.createElement("canvas");
          canvas.width = 16;
          canvas.height = 16;
          var context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
          context.globalCompositeOperation = "source-in";
          context.fillStyle = "#d00";
          context.fillRect(0, 0, 16, 16);
          context.fill();
          callback(canvas.toDataURL());
        };
        var img = document.createElement("img");
        img.addEventListener("load", onImageLoaded);
        img.src = faviconUrl;
      };
      chrome.extension.onRequest.addListener(getFavicon);
    &lt;/script&gt;
  &lt;/head&gt;
&lt;/html&gt;
</pre>

Finally, **favicon.js** is simplified to find or create a `<link>` element,
request the modified favicon data URL for the current page's URL, and render
that data URL back into the page.  I also added a quick caching mechanism to
store the modified favicon in localStorage, so that the script doesn't make
additional favicon requests every time the page is loaded.  This could certainly
be made more sophisticated to expire cached favicons periodically, but works
as a simple example:

<pre class="brush: javascript">
/*
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement("link");
  link.setAttribute("rel", "icon");
  document.body.appendChild(link);
}
var betterFavicon = localStorage["better-favicon"];
if (betterFavicon) {
  link.type = "image/x-icon";
  link.href = betterFavicon;
} else {
  var payload = {url: window.location.href};
  chrome.extension.sendRequest(payload, function(response) {
    link.type = "image/x-icon";
    link.href = response;
    localStorage["better-favicon"] = response;
  });
}
</pre>

This works consistently on all domains I've tried. Enjoy your red icons!

