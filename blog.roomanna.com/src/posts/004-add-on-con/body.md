[link-extension]: https://chrome.google.com/extensions/detail/igocgkpcgelnhiojhabmkhkgcdlpanhp
[link-addoncon]: http://addoncon.com/
[link-chromewebstore]: http://googleblog.blogspot.com/2010/12/update-on-chrome-web-store-and-chrome.html
[img-melting]: /img/2011-01-06-melting.png  "Melting"
[link-doom]: http://doom.wikia.com/wiki/Screen_melt

Last year between the time that the [Chrome web store][link-chromewebstore] 
crazied everything up and the holidays shut everything down, I was invited 
to give an educational session at [Add-on-Con 2010][link-addoncon] on the 
topic of Chrome extensions.  

Despite starting at 9:00am on the teaching day (the day before the conference 
began in earnest), I think the session went well.  I have a Chrome extensions 
presentation which is also 
[a chrome extension itself][link-extension], but it had gotten a bit out of
date.  I took the opportunity to do a bit of work updating the content and
sprucing up the demos a bit.

Of particular note is the demo which uses `chrome.tabs.captureVisibleTab`
to draw the current browser contents into a canvas, and then 2d manipulations
to "melt" the screen (an effect inspired by 
[one of my favorite games][link-doom]):

!["Melting"][img-melting]

I suggest you install the [slides][link-extension] to see it in action.  The
demo is near the end.  This was actually fairly simple to accomplish, so I'll
go over how I built it here.

<!-- -**-END-**- -->

The code that initializes
the animation creates an `<image>`  and a `<canvas>`, then
calls `chrome.tabs.captureVisibleTab` to get a screenshot, which is returned as 
a data URL. Since you can't load a data URL directly into a canvas, the data URL
is assigned to the src of the image. When that loads, the canvas is 
adjusted to match the dimensions of the image and injected into the page's DOM
(with a CSS style to position it absolutely over every other element).
Then it's a matter of stepping through the animation frames until the
effect is finished.

<pre class="brush:javascript">
function renderAnimation() {
  var bufferimage = document.createElement('image');
  var outputcanvas = document.createElement('canvas');
  var outputcontext = outputcanvas.getContext('2d');
  chrome.tabs.captureVisibleTab(null, function(src) {
    bufferimage.addEventListener('load', function() {
      outputcanvas.width = bufferimage.width;
      outputcanvas.height = bufferimage.height;
      outputcanvas.className = 'effectcanvas';
      document.body.appendChild(outputcanvas);
      var stepper = stepAnimation(bufferimage, outputcanvas, 200);
      stepper();
    });
    bufferimage.src = src;
  });
};  
</pre>

The `stepAnimation` method takes a source image, an output canvas, and the 
number of horizontal slices to use as its parameters.  I assign a velocity to
each slice using a sine function during initialization:

<pre class="brush:javascript">
for (var i = 0; i &lt; slices; i++) {
  velocity[i] = Math.abs(Math.sin(i) * 5) + 5;
  offsets[i] = 0;
}
</pre>

The slices move at a constant velocity in a wavy sort of pattern. I like 
using the trigonometric functions for this kind of thing 
because I feel like it leads to nice patterns, as you can see from the 
screenshot above.

Once initialized, I set up a closure which will continue animating the scene
until it determines that the animation is over (every slice is beyond the 
bottom of the screen).  Every time this closure is called, a y-offset is
calculated for each slice, based off of its corresponding velocity.

When the animation completes, the canvas is removed from the DOM, so the
original scene will be drawn again.

<pre class="brush:javascript">
function stepAnimation(src, dst, slices) {
  var slice_width = dst.width / slices;
  var sx = 0;
  var sy = 0;
  var sw = slice_width;
  var sh = dst.height;
  var dx = 0;
  var dy = sy;
  var dw = sw;
  var dh = sh;
  var velocity = []
  var offsets = []
  for (var i = 0; i &lt; slices; i++) {
    velocity[i] = Math.abs(Math.sin(i) * 5) + 5;    // Assign a velocity
    offsets[i] = 0;
  }
  var context = dst.getContext('2d');
  context.fillStyle = '#600';                       // Use a red background
  var stepper = function() {
    var stepagain = false;
    context.fillRect(0, 0, src.width, src.height);  // Clear the old image data
    for (var i = 0; i &lt; slices; i++) {
      sx = i * slice_width;
      dx = sx;
      dy = sy + offsets[i];
      offsets[i] += velocity[i];                    // Calculate the offset
      if (dy &lt; sh) {
        stepagain = true;
      }
      // Draw the slice
      context.drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh);
    }
    if (stepagain) {
      window.setTimeout(stepper, 10);      // Call this method again in 10ms
    } else {
      dst.parentNode.removeChild(dst);     // Remove the canvas from the DOM
    }
  };
  return stepper;
};
</pre>

I think this technique would be very useful for making interesting Chrome OS
screensavers.  I'll probably take a stab at writing one in the future.
