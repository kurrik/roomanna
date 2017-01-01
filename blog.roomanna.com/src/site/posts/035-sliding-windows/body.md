[adagame]: https://twitter.com/kurrik/status/787851789949427712
[deque]: https://en.wikipedia.org/wiki/Double-ended_queue

I've been working on a small [interactive iPad experience][adagame] for my daughter Ada.   I wanted to create a world where objects would respond to touch, break apart, and evolve into different forms.  She's limited to a slappy/flailing motion and I wanted the game playable with only these rough moves.  Gestures such as pinch-to-zoom or even panning the camera purposefully would not be appropriate.  My v1 build therefore added a camera which zoomed to focus the most recently touched item.  This worked well with my (more purposeful) testing, but zoomed around crazily once Ada got her hands on it.

<!--BREAK-->

I thought it would be better to sample the last N touches and then make sure that the camera zoomed appropriately to keep them all in view.  This is easily done if you hold all N points in memory and select the min/max bounds each frame, but wasteful for both memory and CPU.

I've been interested in streaming algorithms for some time now, mostly from working on Twitter's streaming API and trying to figure out what kinds of algorithms work with a high-volume, infinitely long data stream.  There's a very simple sliding window algorithm which will allow you to keep track of the "best" element in the last _k_ elements which operates in linear time and is more efficient in memory usage than just keeping all _k_ elements in a buffer.

This algorithm uses a data structure called a [deque][deque], which is a double-ended queue with constant time insert, peek, and delete operations on both ends of the queue.  I've implemented this as a doubly-linked list for my demos below.  As long as the list holds pointers to the head and tail elements, constant time operations are possible.

As new values come in, they are compared against the tail of the queue.  If the new value "beats" the existing value, the existing value is removed.  You can use any heuristic for comparison, but `min` / `max` seem to be the most common.

Only the tail items are checked (as opposed to filtering all items in the deque) since the queue maintains a sorted order as it is built.  So as soon as the tail element is "better" than the new value, the new value is pushed onto the end of the queue.  Both the value and global index of the new value are stored so that it's possible to tell when a value falls out of the window.

The last step is to check the head of the deque and discard elements which are now outside of the window, as they are no longer valid for comparison. The element at the head of the queue after this step is now the "best" value in the window.

A little more formally, this is:

<pre><code>Let <i>k</i> = the size of the sliding window.
Let <i>Q</i> = an empty deque of tuples.

For each new entry <i>N</i> at index <i>i</i>:

  Let <i>T</i> = the tail entry in <i>Q</i>.
  While <i>N</i> &lt; <i>T<sub>N</sub></i>:
    Remove <i>T</i> from <i>Q</i>.
    Let <i>T</i> = the tail element in <i>Q</i>.

  Push the tuple <i>[N,i]</i> to the end of the deque.

  Let <i>H</i> = the head entry in <i>Q</i>.
  While <i>H<sub>i</sub></i> &lt; <i>i</i> - <i>k</i>:
    Remove <i>H</i> from <i>Q</i>.
    Let <i>H</i> = the head tuple in <i>Q</i>.
</code></pre>

I found this a little unintuitive, so I've built a demo which shows the queue as elements are added and removed.  Add values below to convince yourself that the queue always remains sorted.  It's also useful to verify that it's not necessary to iterate over the entire queue as new values are added, meaning the algorithm runs in linear time:

{{include "post035.demosteps.html"}}

To apply this back to my game, I created a data structure with four such deques.  For all touch events, these queues keep track of the minimum X value, maximum X value, minimum Y value, and maximum Y value inside of a window.  Click the canvas and verify that the correct bounds are drawn around the last 5 points.

{{include "post035.demosvg.html"}}

I expect to set the bounds of my game's viewport to a similar bounding box based off of touch events.  I'll have to make the viewport a little larger (so it's possible to zoom out by touching outside of the bounding box) and animate transitions as the bounding box changes, but the viewport should be smoother and slower moving than before.

