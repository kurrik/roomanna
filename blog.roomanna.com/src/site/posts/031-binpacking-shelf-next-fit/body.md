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

Luckily I found [a paper by Jukka Jylänki covering a lot of bin packing
algorithms](http://clb.demon.fi/files/RectangleBinPack.pdf).
But before I start throwing them into the engine
willy-nilly, I thought it would be instructive to make some toy examples
in Javascript. The first implementation the paper covers is
SHELF-NF (Shelf Next Fit) and I'll be covering that here.

<!--BREAK-->

{{include "post031.templates.html"}}
<div id="controls" data-template="tmplControls"></div>
<div data-template="tmplControlsCount"></div>


### SHELF-NF
<div id="demo1"></div>
