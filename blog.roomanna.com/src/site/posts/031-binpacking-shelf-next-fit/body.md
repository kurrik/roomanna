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
<div id="controls" data-template="tmplControls"></div>

# SHELF-NF
The first implementation the paper covers is
SHELF-NF (Shelf Next Fit).

<div id="demo1"></div>
<div data-template="tmplControlsCount"></div>

