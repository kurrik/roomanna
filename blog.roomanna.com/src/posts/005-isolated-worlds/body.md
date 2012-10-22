[link-groups]: http://groups.google.com/a/chromium.org/group/chromium-extensions/browse_thread/thread/0d65a331cfaeb7ab#
[link-docs]: http://code.google.com/chrome/extensions/content_scripts.html#registration
[img01]: /img/2011-03-10/puttogether01.png  "..."
[img02]: /img/2011-03-10/puttogether02.png  "..."
[img03]: /img/2011-03-10/puttogether03.png  "..."
[img04]: /img/2011-03-10/puttogether04.png  "..."
[img05]: /img/2011-03-10/puttogether05.png  "..."

Chrome Extensions have been praised as being really easy to write, especially
when compared with writing a Firefox xpi or a plugin for IE.  But there's still 
a few concepts that trip up developers regularly.  One of these is the
isolated worlds concept, and it leads to 
[a lot of support questions in the group][link-groups]:

<pre class="blockquote">
My requirement is load jquery.js file into the content script 
when it is not having that js file(For Ex: I am checking for jquery.js 
file,fancybox.js file and if it is not there load these files. ) 

When i implement this logic in content script it is loading the 
jquery.js file. After that it is not working in content script . It is
showing $(or) jQuery is undefined. For every time it is loading,but 
not executing in the content script. 
</pre>
  
The code in question usually winds up being something like:

<pre class="blockquote">
   function loadJQuery() { 
     if (!jQuery) { 
       var script = document.createElement('script'); 
       script.async = true; 
       script.src = "http://url/to/jquery.js"; 
       script.addEventListener('load', function() {
         <strong>// Do something with jQuery, which causes an error.</strong>
       });
       document.head.appendChild(script);
     } 
   }
</pre>

This is a pretty interesting situation
because if you were to use the snippet on a regular web page, there 
would be a decent chance of getting it to work.  But Content Scripts don't 
work just like regular web pages, and not understanding that difference will
lead to painful-to-debug issues like this one.

<!-- -**-END-**- -->

## An overview of extension architecture

A lot of Chrome extensions have structures similar to this:

!['Standard extension format'][img01]

That is, a **manifest.json** file which points to a **background page**, 
a **popup**, and a **content script**.  The content script runs on a few URLs 
defined in the
manifest, the popup is shown whenever a user clicks on a browser or page action
(also defined in the manifest) and the background page just runs all the time.

The three files pointed to by the manifest have a lot of similarities.  They
run JavaScript, have access to a lot of the built-in DOM/JS functions in the
browser, have *some* access to the `chrome.*` namespace, and can communicate 
with each other.

The communication is where a few differences pop up.  You might expect
that all parts of an extension are alike, but that's not true.  For example,
a **background page** and a **popup** both exist in the same Chrome process, 
so they can directly share memory.  This means that you can access a background
page's window object from a popup by calling 
`chrome.extension.getBackgroundPage` 
and access a popup's window object from a background page by calling
`chrome.extension.getViews`:

!['Background page and popup talking to each other'][img02]

This is pretty cool, because a popup could log to the background page's console
like this:

<pre class="brush:javascript">
var bg = chrome.extension.getBackgroundPage();
bg.console.log('This is sent from the popup but shows up in the bg page log!');
</pre>

**Content scripts** are a different story.  They interact with a rendered page,
so they need to be loaded in that process.  This means that the content script
and the background page cannot directly share objects in memory:

!['Background page and content script are separated by a process boundary'][img03]

The two can still pass messages back and forth using 
**chrome.extension.sendRequest** but these messages are serialized and 
deserialized along the way - you can't pass function or object references back
and forth. 

I think that most extension developers handle this distinction pretty well.  At
the very least, it's easy to think *content scripts are just like the regular
page* and move on.

But that's not completely right- there's one more level of isolation in effect,
which is that a content script can't access everything in the web page it is
currently running on.  While the content script can read and write the DOM
nodes on the page without any issue, it can't access native JavaScript code 
in the page:

![''][img04]

The reason for this has a lot to do with JavaScript's dynamic nature.  If the
page and the content script shared a JavaScript execution environment, then
the page could conceivably start calling things like 
`chrome.extension.sendRequest` and messing around with the internals of the
extension.  Since extensions have a lot more power over the system than
regular websites, this is a no-no.

## Fixing the problem

So how does one load jQuery into the content script's execution environment
dynamically?  Unfortunately, you can't.  Loading JavaScript requires inserting
a node into the DOM, and once the DOM loads a script, the code is executed in
the context of the untrusted page.

So this code:

<pre class="brush:javascript">
function loadJQuery() { 
  var script = document.createElement('script'); 
  script.src = "http://url/to/jquery.js"; 
  document.head.appendChild(script); 
};
</pre>

does actually load jQuery, but it puts it into the page's execution context,
not the context of the content script.  In fact, if you were to do something
like:

<pre class="brush:javascript">
function loadMyScript() { 
  var script = document.createElement('script'); 
  script.src = chrome.extension.getURL("myscript.js"); 
  document.head.appendChild(script); 
};
</pre>

you would be able to load JavaScript resources packaged with your extension 
into the context
of arbitrary web pages.  Which can be useful if you really need to get into
that JavaScript context for whatever reason.

An extension can still rely on jQuery, although not dynamically.  Just 
reference the appropriate file
in the `content_scripts` section of your **manifest.json** file:

<pre class="brush:javascript">
{
  ...
  "content_scripts": [
    {
      "matches": ["http://www.google.com/*"],
      "js": ["jquery.js", "myscript.js"]
    }
  ],
  ...
}
</pre>

Of course you knew that, since it's almost verbatim from the 
[documentation][link-docs], right?
