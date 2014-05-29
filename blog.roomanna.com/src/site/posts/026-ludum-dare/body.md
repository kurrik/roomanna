[1]: http://www.ludumdare.com/compo/ludum-dare-21/?action=preview&uid=398
[2]: https://github.com/kurrik/ld26/commit/d59f4b6abab14bfc5ada35d4591fc0a8f9fae93b
[3]: http://eg.regio.us/ld26/
[4]: https://twitter.com/kurrik/timelines/414509692761567232

Ludum Dare is a game jam. Every 4 months
a weekend is selected and a theme is announced. Thousands of game developers
have the weekend to design, create, and release games for a competition
where there are no official judges and no grand prize.

It's the most rewarding creative activity I've ever done.

<!--BREAK-->

I learned about Ludum Dare through Notch, creator of Minecraft.
There was a weekend right
after I had started working for Twitter where I found myself
obsessing over a live feed where he was coding an
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
what to do next.  It's what I like about shows like Top Chef or Junkyard Wars,
because the cast doesn't stop to tell you every step of what they're doing - you
have to follow along and figure it out.
I'd never watched any programmer create something from start to finish before
but I saw what Notch was doing and all of it made sense.
I wanted to see if I could program that way.

I think many people see computers as fixed, opaque things which perform
standard built-in functions.  They don't think of the
underlying malleability.  I grew up building tower
PCs and installing DOS and configuring my config.sys in order to
have enough RAM to be able to run the programs I wanted.  At that point
there wasn't a lot of separation between using a computer and programming one.
I had always been interested in games and it seemed obvious that
they were the kind of thing a computer user could create.

There would be these computer trade shows where one could walk
around from booth to booth and look for the best prices on processors, RAM,
hard drives and any of the dozen other parts needed to assemble a PC.
I would have to be diligent to follow my father through the crowd
lest we be separated. If I were good and didn't get lost
he would offer me the chance to select something I wanted.  At one point
I found myself torn between a copy of SimAnt and a book on programming
games in BASIC. It was a test - I was offered
the choice between one expensive game which would be
interesting for a few months, or a $5 book which would have helped me
make the games I wanted to play for the rest of my life.

I failed the test.  I knew you could enter a cheat and play as the spider
in SimAnt, the promise of which furiously outshone the potential of even
a million handmade games.

But I kept revisiting the choice in my head.  At some point, long after SimAnt
had grown stale, I obtained the most formidable book on game
programming I could locate - "Tricks of the Game Programming Gurus".

<p class="centered">
  <img src="{{link "gurus.png" }}" />
</p>

I memorized Gurus front-to-back despite its basis in C, a language I had
never used.  It was difficult to get a C compiler for DOS at that time - I
remember friends having floppy disks with pirated copies of Borland on them.
I never programmed a single example out of the book but the techniques
lodged themselves into a deep,
weird part of my brain where they were never able to escape.
To this day I still remember how to do 2D sprite-based animation and effects.
I know raycasting for Wolf3D style rendering engines.  I know _how_ to
make a game, but up until Ludum Dare, I had never
completed one before.

It took me nine months to participate
in my first jam.  When I saw that I finally
had a free weekend for Ludum Dare 24 in late 2012,
I knew I was finally going to be able to test my limits.

I had some flashes of insight during the weekend.  Sprite blitting,
hit zones, animation states, all came naturally.
But I got hung up on details and didn't pace myself well.
The result was a
barely playable platformer missing any of the nuanced controls, level design,
or even artwork present in a Super Mario Bros. game.
There was barely a single level which displayed a win screen if you got all
the way to the right hand side.  But
it was, in essence, a game which required skill to play.  There was a
beginning, middle, and end.  Importantly, it was the first game I had
written with all three of these elements.


It sounds
ridiculous but the most important part of being a game developer is
actually making games.  In the years since reading Gurus, I've started
half a dozen exploratory game projects but never got anywhere.  It's tough
to start a long term project from scratch, as the temptaion to design
systems, create intense object hierarchies, and learn half a dozen new
frameworks all prevent you from actually getting any real work done.
Ludum Dare forces you to cut through all that.  If you want to get
something done, you have to _hustle_, make decisions which result in a
product _stat_.  Almost none of the code we wrote is directly usable,
but the ideas are a basis for much more.
