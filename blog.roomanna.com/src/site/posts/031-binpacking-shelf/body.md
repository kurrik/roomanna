I've recently been working on an update to the
[twodee library](https://github.com/pikkpoiss/twodee) we use for Ludum Dare
games.  One (of many) areas I'll be focusing on is speeding up text rendering.

Text is currently very slow because we have to create and bind a new texture,
render glyphs to it, then draw geometry for each piece of text in a scene.
One simple optimization is to pack frequently-used text into a single texture
which will remove many (expensive) texture binds.

Packing a bunch of rectangles into a texture isn't the easiest
thing to do well.  There's a whole class of algorithms dealing with this
"bin packing" problem, each with various tradeoffs. Luckily, I found
[a very useful paper
](http://clb.demon.fi/files/RectangleBinPack.pdf) which
covers many of these algorithms (thanks Jukka Jylänki!).
To get a feel for how well each of them perform, I decided to implement a few in
Javascript (you can see the
[source here](https://github.com/kurrik/roomanna/tree/master/blog.roomanna.com/src/site/posts/031-binpacking-shelf/src)).

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
of string.

<div data-template="tmplControlsWord"></div>

By changing the values above, the following list will update.  Each algorithm
will attempt to pack the same list of strings.

<div data-template="tmplWordList"></div>

There are a few assumptions I made which will make my implementations differ
from Jukka's paper.  It is concerned with the rotation of the nested
rectangles to achieve an optimal fit. Since my text strings are generally
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
space is no longer considered usable.  If a small rectangle which would fit
in the extra space shows up later, it is placed on the current shelf instead.
Hence, there's a ragged right edge of wasted
space as the word count grows.

<div id="demo-shelfnf"></div>
<div data-template="tmplControlsCount"></div>

The next several algorithms attempt to reclaim some of that space in various
ways.  This comes with a cost &mdash; where SHELF-NF runs in O(N) time
and O(1) space, the remaining algorithms are implemented in O(N^2) time
and consume O(N) space. The extra cost is required to keep track of and
search through all of the prior shelves.

# Shelf First Fit (SHELF-FF)

To try and reduce the wasted space, Shelf First Fit
iterates over every shelf for each new word. It inserts the text
into the first shelf with available space (creating a new shelf if no
existing shelf has room).

<div id="demo-shelfff"></div>
<div data-template="tmplControlsCount"></div>

My first intuition was that SHELF-FF would always be a better approach.  This
is incorrect &mdash; it
may wind up making locally-optimal choices which reduce the global efficiency.
Consider an "unlucky" case where placing a small word on
a prior row aligns a lot of future words in a worse way.

# Shelf Best Width Fit (SHELF-BWF)

Shelf Best Width is like SHELF-FF, but instead of choosing the first
shelf with room, chooses the horizontally-smallest shelf with enough
room for the word.

    function heuristic(shelf, word) {
      return shelf.remainingX() - word.width;
    };

<div id="demo-shelfbwf"></div>
<div data-template="tmplControlsCount"></div>

In terms of efficiency I don't see a ton of difference between SHELF-BWF
and SHELF-FF, although if you set the image dimensions to be tall and narrow
there are sometimes differences in the layout on the texture.

# Shelf Best Height Fit (SHELF-BHF)

Shelf Best Height optimizes for lowest remaining vertical space.  Since there's
not a ton of variance in rectangle heights I didn't expect this to be
very efficient.  In tall and narrow images I found a few examples where it
performed worse than SHELF-FF.

    function heuristic(shelf, word) {
      return shelf.height - word.height;
    };

<div id="demo-shelfbhf"></div>
<div data-template="tmplControlsCount"></div>

# Shelf Best Area Fit (SHELF-BAF)

Shelf Best Area fit optimizes for minimum remaining area after the word is
placed.

    function heuristic(shelf, word) {
      var shelfArea = shelf.remainingX() * shelf.height,
          wordArea = word.width * word.height;
      return shelfArea - wordArea;
    };

<div id="demo-shelfbaf"></div>
<div data-template="tmplControlsCount"></div>

On this text-like input SHELF-BAF performs very close to SHELF-BWF.  Higher
variance in font size can introduce some efficiency
differences but not in a meaningful way.

# Shelf Worst Width Fit (SHELF-WWF)

Shelf Worst Width Fit is the most unusual SHELF algorithm.  It is based
off of the idea that rectangles should be packed in shelves which would
result in the most remaining space (with the exception that if a word fits
exactly it should be placed right away).

    function heuristic(shelf, word) {
      if (shelf.remainingX() === word.width) {
        return Number.MAX_VALUE; // Immediately pick this fit.
      }
      return shelf.remainingX() - word.width;
    };

    function compare(score, bestScore) {
      return score > bestScore; // Higher is better.
    };

<div id="demo-shelfwwf"></div>
<div data-template="tmplControlsCount"></div>

Presumably leaving more space might allow for bigger words to be placed
in extra space, but in practice this seemed to consistently perform
the worst of the non-SHELF-NF algorithms on the text input.

# Summary

The input I'm testing is very special-purposed so these results are probably
not indicative of general performance.  But for text, it generally
seems that SHELF-NF performs worst, followed
by SHELF-WWF and SHELF-FF.  The remaining algorithms tend to be pretty close,
with SHELF-BWF or SHELF-BAF having the best result.

It is possible to contrive specific examples to make any specific algorithm
"win", and I've found it useful to view how changing the page parameters
makes different algorithms stand out.  I've added another set of
controls and a summary view for your convenience in case you wish to do the
same. The parameters will change the examples above so you can visually
examine any given packing by scrolling up.

<div data-template="tmplControlsImage"></div>
<div data-template="tmplControlsSeed"></div>
<div data-template="tmplControlsSize"></div>
<div data-template="tmplControlsWord"></div>

<div id="Summary"></div>

Of course, SHELF is not the only class of bin packing algorithm.  There are
several more advanced approaches which will probably have better performance.
I expect to visit them in a similar update in the near future.
