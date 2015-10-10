I've recently been working on an update to the
[twodee library](https://github.com/pikkpoiss/twodee) we use for Ludum Dare
games.  One (of many) areas I'll be focusing on is speeding up text rendering.

Text is currently very slow because we have to create and bind a new texture,
render text to it, and draw geometry for each piece of text in a scene.
One simple optimization is to pack frequently-used text into a single texture
which will remove many (expensive) texture binds.

Packing a bunch of rectangles into a texture isn't the easiest
thing to do well.  There's a whole class of algorithms dealing with this
"bin packing" problem, each with various tradeoffs. Luckily, I found
[a very useful paper
](http://clb.demon.fi/files/RectangleBinPack.pdf) which
covers many of these algorithms (thanks Jukka Jylänki!).
To get a feel for how well each of them perform, I decided to implement a few in
 Javascript.

<!--BREAK-->

{{include "post031.templates.html"}}

I'm making a few assumptions about my use.  First, that I will start with
a predefined texture width and grow the height in powers of two.  This will
let me extend the texture size without needing to repact everything already
in there.  The initial width can be configured here:

<div data-template="tmplControlsWidth"></div>

Static examples are pretty boring, so there is some randomness in my word
generation.  For reproducibility, I've used a random number generator which
accepts a seed, which can be configure here:

<div data-template="tmplControlsSeed"></div>

I borrowed [Amit Patel's random
noise generator](http://www.redblobgames.com/articles/noise/introduction.html)
and used it to create some parameterized random text.  Changing the Exponent
sliders below will change the way the random distribution looks.  Lower values
wind up looking more like a sine wave, while higher values look more chaotic.

You can configure the lengths of the random words as well as the number of
words to pack:

<div data-template="tmplControlsWord"></div>

And the size of the text:

<div data-template="tmplControlsSize"></div>

The selected values above have resulted in the following word list, which
we will attempt to pack using different algorithms:

<div data-template="tmplWordList"></div>

There are a few assumptions I made which will make my implementations differ
from Jukka's paper.  The paper concerns itself with rotation of the nested
rectangles to achieve an optimal fit, but since my text strings are generally
more likely to be wider than tall (and about the same height) I'm not going to
worry about it.

I'm also going to pack from the top down, as opposed to bottom up.  This just
makes the visualization a little nicer on this page. I could easily flip the
y-coordinate to render bottom-up, like OpenGL texture coorindates.

# Shelf Next Fit (SHELF-NF)

The simplest class of packing algorithms are labeled SHELF since they
approach the problem by trying to fit as many rectangles onto a horizontal
row (or shelf) as possible.

Shelf next fit is the most direct implementation of this idea:

1. For each rectangle in the rectangles list:
  1. If the rectangle does not fit in the current shelf:
    1. Close the current shelf.
    2. If there is no room for a new shelf:
      1. Extend the image vertically.
    3. Open a new shelf with height 0.
  2. Add the rectangle to the current shelf.
    1. If the rectangle's height is greater than the shelf's height:
      1. Set the shelf height to the rectangle's height.

This is inefficient in the sense that when a shelf is closed, any remaining
space is no longer considered usable even if a small rectangle shows up
which would otherwise fit.  Hence, there's a ragged right edge of wasted
space as the word count grows.

<div id="demo-shelfnf"></div>
<div data-template="tmplControlsCount"></div>

# Shelf First Fit (SHELF-FF)


<div id="demo-shelfff"></div>



<div data-template="tmplControlsCount"></div>

