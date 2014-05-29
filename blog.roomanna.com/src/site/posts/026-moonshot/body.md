[1]: http://www.ludumdare.com/compo/ludum-dare-21/?action=preview&uid=398
[2]: https://github.com/kurrik/ld26/commit/d59f4b6abab14bfc5ada35d4591fc0a8f9fae93b
[3]: http://eg.regio.us/ld26/
[4]: https://twitter.com/kurrik/timelines/414509692761567232

"You didn't put the happy face on the Moon!" Steph was indignant.  Resigned,
I opened up Fireworks one more time, sketched a spontaneous face on top of my
moon sprite, and blew the image up to 256 pixels wide.  The pupils looked weird.

<!--BREAK-->

"Eyes or no eyes?" I asked, turning the laptop around to show the others in
the room.  It was judged that the pupils were creepy, so they were left out.
I completed a final build and copied it to the Mac mini plugged into the
television.

I sat back and sipped on a beer which had gone a little warm.  Amy took
the wireless keyboard and started to work her way through the puzzles.
50 hours ago Moonshot wasn't even an idea.  There wasn't a single line of
code checked into its repo.  Now I was watching someone interact with an
entire world which Wes and I had created in a little over two days.

Amy finished the final level and the victory screen popped up.
A grinning moon face shone in the center.

"Perfect" I thought.

Wes and I had created Moonshot, a puzzle game with a physics mechanic
for a 48 hour game programming competition called Ludum Dare.  Every 4 months
a weekend is selected and a theme is announced. Thousands of game developers
have the weekend to design, create, and release games for a competition
where there are no official judges and no grand prize.

<p>
<blockquote class="twitter-tweet" align="center"><p>Working with a partner so we're technically entering the 72 hour Jam, but still aiming for 48. The extra 24 hours are bourgeoisie <a href="https://twitter.com/search/%23LD48">#LD48</a></p>&mdash; Arne Roomann-Kurrik (@kurrik) <a href="https://twitter.com/kurrik/status/327974549054439424">April 27, 2013</a></blockquote>
</p>

The team rules for Ludum Dare extend the time period to 72 hours,
but Wes and I agreed to do our best to get something done in 48.
On April 26 2013 I finished work early and ran
over to the market to purchase necessities - beer, chips, bourbon, Coke.
The theme announcement was scheduled to arrive via Tweet at 7pm.
Wes showed up at 6:56.

<p>
<blockquote class="twitter-tweet" align="center"><p>The Theme for Ludum Dare 26 is: Minimalism <a href="https://twitter.com/search/%23LD48">#LD48</a> <a href="https://twitter.com/search/%23GoodLuck">#GoodLuck</a></p>&mdash; Ludum Dare (@ludumdare) <a href="https://twitter.com/ludumdare/status/327965350337585152">April 27, 2013</a></blockquote>
</p>

Wes and I looked at each other, dumbfounded.  How do you make a game about
Minimalism?  There were obviously going to be a million games based on
Mondrian paintings, but I was actually looking forward to doing some
intricate sprite work over the weekend.  I didn't want my characters
to be blocks or lines.

I think Wes first came up with the idea of minimalist one-button gameplay.
I forget who said "space" first.  After those two constraints, ideas
began to flow.  By 7:30 we [had a concept][2] which wound up being very
close to the final product.

I learned about Ludum Dare through Notch.  There was a weekend right
after I had started working for Twitter where I found myself
obsessing over a live feed of Notch coding an
entire [Wolf3D-style game][1] in 48 hours.  To check in periodically
and see his progress was intoxicating. I saw game mechanics grow from placeholder
functions to actual things the player could do in the game. Puzzles
grew up around these mechanics.  He had strategies for
making a level out of a single bitmap, and for adding new items and level types
by editing a single sheet of textures.  He was hot reloading Java objects
in the middle of playing the game, so his code, compile, and test cycle
was incredibly short.

I love seeing a professional
in any field working at this level - where
there's this incredible economy of action, and they never seem to question
what to do next.  I wanted to see if I could program that way.

It took me nine months to participate
in my first Ludum Dare after watching Notch.  When I saw that I finally
had a free weekend for Ludum Dare 24 in August 2012,
I knew I was finally going to be able to see where my limits were.

I think many people see computers as fixed, opaque things, which fulfill
standard functions built into their software.  They don't think of the
underlying malleability of a computer.  But I grew up building tower
PCs and installing DOS and configuring my config.sys in order to
have enough RAM to be able to run the programs I wanted.  At that point
there wasn't a lot of separation between using a computer and programming one.
I had always been interested in games and it seemed rather obvious that
they were the kind of thing a computer user could create.

When I was young there would be these computer trade shows where you'd walk
around from booth to booth and look for the best prices on processors, RAM,
hard drives, and any of the dozen other parts needed to assemble a PC.
I would have to be diligent to follow my father through the crowd
lest we be separated and lost indefinitely. If I were good and didn't get lost
he would offer me the chance to select something I wanted.  Once I found myself
torn between a copy of SimAnt and a book on programming games in BASIC.
In hindsight it was a bit of a test - I was offered
the choice between one expensive game which would be
interesting for a few months, or a $5 book which would have helped me
make the games I wanted to play for the rest of my life.

I regretted not getting the book.  When SimAnt lost its lustre I asked
for the most formidable book on game programming I could locate -
"Tricks of the Game Programming Gurus".  I memorized it front-to-back
despite its basis in C, a language I had never used.  It was difficult to
get a C compiler for DOS at that time - I remember friends having floppy
disks with pirated copies of Borland on them.  I never programmed a single
example out of that book but the techniques lodged themselves into a deep,
weird part of my brain where they were never able to escape.
To this day I _know_ how to do 2D sprite-based animation and effects.
I _know_ raycasting for Wolf3D style rendering engines.  I _know_ how to
make a game, but up until I had learned about Ludum Dare, I had never
completed one before.

<p class="centered">
  <img src="{{link "gurus.png" }}" />
</p>

I had some flashes of insight during Ludum Dare 24.  The sprite blitting,
hit zones, animation states all came naturally.  But I did get hung up on
details and didn't pace myself well. The result was a barely playable
platformer, but with none of the nuanced controls, level design, or even
artwork present in Super Mario Bros.  There was barely a single level which
displayed a win screen if you got all the way to the right hand side.  But
it was, in essence, a game which required skill to play.  There was a
beginning, middle, and end.  Importantly, it was the first game I had
written with all three of these elements.

Flash forward to April 2013.  50 hours after "Minimalism" was announced,
we had [a full entry][3] playable, with 6 levels, a couple interesting
physics puzzles, achievements, a world map, and an end screen.  I had learned
from LD24 and spent my time efficiently, not worrying about getting things
100% perfect, but making sure that the major features were sketched out
early and improved over the weekend.  Reading [my Tweets from the jam][4],
the highs and lows come through, but also a sense of confidence and
inevitability.  We knew what we were building, we knew how much work there
was to do, we knew the steps we needed to go through to wind up with a
playable result.

<p class="centered">
  <img src="{{link "moonshot.png" }}" />
</p>

Moonshot wasn't the most beautiful game ever (or even of the weekend)
but it was enjoyable to play - the simple "one button" mechanic wound up
being pretty addictive.  Wes and I placed #164 overall for the Jam, and
in the top 100 for "fun".

<p>
<blockquote class="twitter-tweet" lang="en" align="center"><p>Ludum Dare is over, votes are tallied, and Moonshot ranked #164 overall in the Jam category. #89 for Fun! <a href="http://t.co/BSztvoKFYX">pic.twitter.com/BSztvoKFYX</a></p>&mdash; Arne Roomann-Kurrik (@kurrik) <a href="https://twitter.com/kurrik/statuses/336712053651828736">May 21, 2013</a></blockquote>
</p>

That in itself was amazing and a welcome acknowledgement for the hard work
we put in.  But the true reward was the game we wound up with.  It sounds
ridiculous but the most important part of being a game developer is
actually making games.  In the years since reading Gurus, I've started
half a dozen exploratory game projects but never got anywhere.  It's tough
to start a long term project from scratch, as the temptaion to design
systems, create intense object hierarchies, and learn half a dozen new
frameworks all prevent you from actually getting any real work done.
Ludum Dare forces you to cut through all that.  If you want to get
something done, you have to _hustle_, make decisions which result in a
product _stat_.  Almost none of the code we wrote is directly usable,
but the ideas are a basis for much more.  In fact, I've spent the first
few weeks of 2014 porting the original Go code to C++ so that I can build
a version for mobile phones, where the minimalist mechanic works beautifully.

<p class="centered">
  <iframe width="560" height="315" src="//www.youtube.com/embed/gjPWP08ZS8A" frameborder="0" allowfullscreen></iframe>
</p>

I'm excited by what the future holds.  Sure enough, if I had made a more
responsible decision on the day with SimAnt, I may have been a published
game designer by now.  But at the same time, I refuse to believe that
it's too late to learn.  I spent years of my life wanting to create
something, but it only took one weekend to get started. That warm beer,
drank while Amy completed the first playthrough of _our game_, was
especially savory.
