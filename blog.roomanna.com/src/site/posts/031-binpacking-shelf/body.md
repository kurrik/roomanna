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
 Javascript (you can see the [source here
](https://github.com/kurrik/roomanna/tree/master/blog.roomanna.com/src/site/posts/031-binpacking/src)).

<!--BREAK-->

{{include "post031.templates.html"}}

In production, I would use a bin packing implementation which would grow the
texture image when it ran out of space, or just fail if it couldn't find room
for a new rectangle.

Here, I'm going to fix a texture size and allow overflows.  This should
highlight the efficiency of each algorithm through some key metrics:

- How much of the image is filled up by text?
- How much of the text overflowed out of the image?
- How many words fit before an overflow?

The texture size can be adjusted with these controls:

<div data-template="tmplControlsImage"></div>

Static examples are pretty boring, so there is some randomness in my word
generation.  For reproducibility, I've used a random number generator which
accepts a seed, which can be configure here:

<div data-template="tmplControlsSeed"></div>

I borrowed [Amit Patel's random
noise generator](http://www.redblobgames.com/articles/noise/introduction.html)
and used it to create some parameterized random text.  Changing the Exponent
sliders below will change the way the random distribution looks.  Lower values
wind up looking more like a sine wave, while higher values look more chaotic.

You can configure the distribution of font sizes in the text:

<div data-template="tmplControlsSize"></div>

The lengths and count of strings are adjustable as well. I'm just generating
words of varying lengths but the generated text could really be any type
of string:

<div data-template="tmplControlsWord"></div>

The selected values above have resulted in the following list, which
will be packed using different algorithms:

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

Shelf Next Fit is the most direct implementation of this idea:

1. For each rectangle in the list of strings to pack:
   1. If the rectangle does not fit in the current shelf:
      1. Close the current shelf.
      2. Open a new shelf with height 0.
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

To try and reduce the wasted space on the right edge, Shelf First Fit
iterates over every shelf for each new word, inserting into the first shelf
with available space (creating a new shelf if no existing shelf has room).

My first intuition was that this would always be a better approach
but SHELF-FF's greedy approach
may wind up making locally-optimal choices which reduce the global efficiency
of the packing.  Consider an "unlucky" case where placing a small word on
a prior row aligns a lot of larger future words in a worse way.

<div id="demo-shelfff"></div>
<div data-template="tmplControlsCount"></div>

# Shelf Best Width Fit (SHELF-BWF)

Like SHELF-FF, but instead of choosing the first shelf with room, choose
the smallest shelf with enough room for the word.

In terms of efficiency I don't see a ton of difference between SHELF-BWF
and SHELF-FF, although if you set the image dimensions to be tall and narrow
there are sometimes differences in the layout on the texture.

    function heuristic(shelf, word) {
      return shelf.remainingX() - word.width; // Score is leftover X space.
    };

<div id="demo-shelfbwf"></div>
<div data-template="tmplControlsCount"></div>

# Shelf Best Height Fit (SHELF-BHF)

Shelf Best Height optimizes for lowest remaining vertical space.  Since there's
not a ton of variance in rectangle heights I didn't  expect this to be
very efficient.  In tall and narrow images I found a few examples where it
performed worse than SHELF-FF.

    function heuristic(shelf, word) {
      return shelf.height - word.height; // Score is leftover Y space.
    };

<div id="demo-shelfbhf"></div>
<div data-template="tmplControlsCount"></div>

# Shelf Best Area Fit (SHELF-BAF)

Shelf Best Area fit optimizes for minimum remaining area after the word is
placed.

    function heuristic(shelf, word) {
      var shelfArea = shelf.remainingX() * shelf.height,
          wordArea = word.width * word.height;
      return shelfArea - wordArea; // Score is leftover area.
    };

<div id="demo-shelfbaf"></div>
<div data-template="tmplControlsCount"></div>

# Shelf Worst Width Fit (SHELF-WWF)

    function heuristic(shelf, word) {
      if (shelf.remainingX() === word.width) {
        return Number.MAX_VALUE; // Immediately pick this fit.
      }
      return shelf.remainingX() - word.width; // Score is leftover X space.
    };

    function compare(score, bestScore) {
      return score > bestScore; // Higher is better.
    };

<div id="demo-shelfwwf"></div>
<div data-template="tmplControlsCount"></div>

# Summary

<div data-template="tmplControlsImage"></div>
<div data-template="tmplControlsSeed"></div>
<div data-template="tmplControlsSize"></div>
<div data-template="tmplControlsWord"></div>

<div id="Summary"></div>
