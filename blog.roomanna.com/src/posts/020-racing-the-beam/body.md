[1]: http://www.amazon.com/Racing-Beam-Computer-Platform-ebook/dp/B0032N1UMY/

[Racing the Beam][1] is kind of like a biography for the Atari systems and
 their unique underlying circuit design.  Actually, it's kind of like one of
 those band documentaries where the band is already established so you just
 follow them around and see their interactions with common folk.  Eventually
 there's some scene where a band member blows up or throws a tantrum and
 probably didn't mean anything at the time but foreshadows the
 band's eventual downfall/breakup and so forth.

<!--BREAK-->

In Racing the Beam you don't see how the Atari was designed. Instead,
the book seems to expect a little bit of knowledge about the system design (even
from a wires and chips point of view).  Instead of holding your hand with regard
to the technology involved,
the focus is on tricks used to write games, the personalities
behind those games, and then the kinds of problems which wound up
killing the whole platform off.

I found it interesting that the abundance
of low quality software on the platform is generally attributed to killing
the Atari. I've been party to a lot of discussions involving curation of
app stores during my career and I think that this is the first practical example
I've seen where lack of curation was attributed toward the death of
an entire ecosystem.

The book establishes an abstract argument about how the expression of
hacking around the limitations of the system was really a form of art
in itself.  I'm not sure I was convinced of this solely from the basis of the
argument in the book.  It was weird to cover
the internals of the system in depth and then jump into a more philosophical
point of view about art and artistry in electrical and software design.

I did like hearing about how influential a single person would be for the
development of these games, leading up everything from
programming to art to sound and controls.  These auteurs were also
given free reign to try out original ideas, leading to a lot of original
game concepts.

Yet programmers were still seemingly deemed commodities even though
they added so much personality to each product.  This wound up leading
to easter eggs embedded in many games.   It also seemed like programming
and porting games was much more of a cowboy culture.  For example:

<blockquote><p>Brad Stewart, who had earlier done the port of Breakout
to the Atari VCS after winning the right to port the game by besting a
fellow programmer in the arcade Breakout</p></blockquote>

I was really interested to learn how the hardware designed the visual look of
the platform. I think I attributed the Atari look to aesthetic choice when I
was younger, but this was a result of limited hardware and resources.
For example, a
scan line could only change colors dynamically every 3 "pixels" across its
sweep, leading to very wide looking characters and non-sprite graphics.

There were also a maximum of two sprites which could be drawn on screen
at once.  To hack around this, some incredibly clever tricks were used.
For example, Pac Man drew the player's sprite each frame, but each of the four
ghosts on alternating frames:

<blockquote><p>The TIA synchronizes with an NTSC television picture sixty
times per second, so the resulting display shows a solid Pac-Man, maze,
and pellets, but ghosts that flicker on and off, remaining lit only one
quarter of the time.</p></blockquote>

The book is filled with interesting examples like this.  As someone
non-ironically into Atari, game programming, and computer design, I
felt like there was a lot to appreciate.  It may not be for everyone though,
particularly if you've never owned or played an Atari 2600.
