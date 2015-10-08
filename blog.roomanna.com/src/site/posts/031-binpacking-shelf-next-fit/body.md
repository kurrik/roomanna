I've recently been working on an update to the
[twodee library](https://github.com/pikkpoiss/twodee) we use for Ludum Dare
games.  One (of many) areas I'll be focusing on is speeding up text rendering.
Text is currently very slow because we have to create and bind a new texture,
render text to it, and draw geometry for each piece of text in a scene.

There are many possible improvements to this.  I've been thinking about
storing the textures in an LRU cache and also packing frequently-used text
into a single texture. The latter
approach avoids binding a texture for each piece of text, which is expensive.
However, packing a bunch of rectangles into a texture isn't the easiest
thing to do well.  There's a whole class of algorithms dealing with this
"bin packing" problem.  Each algorithm makes tradeoffs between efficiency,
speed, and ease of implementation.

I found [a really useful paper
](http://clb.demon.fi/files/RectangleBinPack.pdf) by Jukka Jylänki which
covers many of these bin packing algorithms.  To get a feel for how well
each of them perform I thought it would be instructive to make some toy
examples in Javascript, which you can see below.

<!--BREAK-->

Static examples are pretty boring, so I borrowed [Amit Patel's random
noise generator](http://www.redblobgames.com/articles/noise/introduction.html)
and used it to create some parameterized random text.  You can play with
the sliders below and the examples in this page will update with the new
values.

{{include "post031.templates.html"}}
<div id="controls" data-template="tmplControlsGlobal"></div>
<div id="controls" data-template="tmplControlsWord"></div>
<div id="controls" data-template="tmplWordList"></div>

<div id="controls" data-template="tmplControlsSize"></div>

There are a few assumptions I made which will make my implementations differ
from Jukka's paper.  The paper concerns itself with rotation of the nested
rectangles to achieve an optimal fit, but since my text strings are generally
more likely to be wider than tall (and about the same height) I'm not going to
worry about it.

I'm also going to pack from the top down, as opposed to bottom up.  This just
makes the visualization a little nicer on this page. I could easily flip the
y-coordinate to render bottom-up, like OpenGL texture coorindates.

Finally, I'm just going to hardcode the image width and grow the height
by powers of 2, which I think is more realistic in representing how I would
really grow a texture image when streaming in strings over time.

# SHELF-NF

The simplest class of packing algorithms are labeled SHELF since they
approach the problem by trying to fit as many rectangles onto a horizontal
row (or shelf) as possible.

Shelf next fit is probably the most direct implementation of this idea:

    For each rectangle in the rectangles list:

        If the rectangle does not fit in the current shelf:
            Close the current shelf.

            If there is no room for a new shelf:
                Extend the image vertically.

            Open a new shelf with height 0.

        Add the rectangle to the current shelf.

        If the rectangle's height is greater than the shelf's height:
            Set the shelf height to the rectangle's height.

<div id="demo1"></div>

<div data-template="tmplControlsCount"></div>

