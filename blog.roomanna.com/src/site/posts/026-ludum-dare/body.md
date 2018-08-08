[1]: http://www.ludumdare.com/compo/ludum-dare-21/?action=preview&uid=398
[2]: http://eg.regio.us/ld26/
[3]: http://eg.regio.us/ld29/

Ludum Dare is a game jam. Every 4 months a weekend is selected and a theme is
announced. Thousands of game developers have the weekend to design, create, and
release games for a competition where there are no official judges and no grand
prize.

It's been the most rewarding creative outlet I've ever had.

<!--BREAK-->

I learned about Ludum Dare through Notch, creator of Minecraft.  One weekend I
found myself obsessing over a live feed where he was coding an entire
[Wolf3D-style game][1] in 48 hours.  I saw game mechanics grow from placeholder
functions to actual things the player could do. Gameplay sprung up from these
mechanics.  I learned Notch's strategies for developing a game efficiently.
His map editor was a paint program, and he used the alpha channel of an image
to encode walls, doors, and items.  His textures were all edited in a single
sprite sheet and making graphical changes was very easy.  He was hot reloading
Java objects in the middle of playing the game, so his code, compile, and test
cycle was incredibly short.

I love seeing a professional in any field working at this level&mdash;where
there's an incredible economy of action, and never any breaks to figure out
what to do next.  It's what I like about shows like Top Chef, because the cast
doesn't stop to tell you every step of what they're doing, you have to follow
along and figure it out.  I'd never watched any programmer create something
from start to finish before but I saw what Notch was doing and all of it made
sense.  I wanted to see if I could program that way.

I think many people see computers as opaque things which perform a fixed set of
functions.  I like to think of the underlying malleability.  I grew up building
tower PCs and installing DOS and configuring my config.sys in order to have
enough RAM to be able to run games.  At that point there wasn't a lot of
separation between using a computer and programming one.  I was interested in
making games and it seemed obvious that they were the kind of thing a computer
user could create.

When I was younger, I'd go to computer trade shows with my father.  We'd walk
around from booth to booth and look for the best prices any of the dozen parts
needed to assemble a PC.  I would have to be diligent to follow my father
through the packed hall.  If I were good and didn't get lost he would offer me
the chance to select something I wanted.  At one point I found myself torn
between a copy of SimAnt and a book on programming games in BASIC. It was a
test - I was offered the choice between one $50 game which would be interesting
for a few months, or a $5 book which would have helped me make the games I
wanted to play for the rest of my life.

I failed the test.  I knew you could enter a cheat and play as the spider
in SimAnt, the promise of which furiously outshone the potential of even
a million handmade games.

But I kept revisiting the choice in my head.  At some point, long after SimAnt
had grown stale, I obtained the most formidable book on game
programming I could locate - "Tricks of the Game Programming Gurus".

<div class="roomanna-centered">
  <figure class="roomanna-figure">
    {{template "image" (.Image "gurus")}}
  </figure>
</div>

I memorized Gurus front-to-back despite its basis in C, a language I had never
used.  It was difficult to get a C compiler for DOS at that time - I remember
friends having floppy disks with pirated copies of Borland on them.  I never
programmed a single example out of the book but the techniques lodged
themselves into a deep, weird part of my brain where they were never able to
escape.  To this day I still remember how to do 2D sprite-based animation and
effects.  I know raycasting for Wolf3D style rendering engines.  I know _how_
to make a game, but up until Ludum Dare, I had never completed one before.

It took me nine months from watching Notch to participate in my first jam.  In
late 2012, when I saw that I finally had a free weekend for Ludum Dare 24 I
knew I was finally going to be able to test my limits.

I had some flashes of insight during the weekend.  Sprite blitting, hit zones,
animation states, all came naturally.  But I got hung up on details and didn't
pace myself well.  The result was a barely playable platformer missing any of
the nuanced controls, level design, or even artwork present in a Super Mario
Bros. game.  There was barely a single level which displayed a win screen if
you got all the way to the right hand side.  But it was, in essence, a game
which required skill to play.  There was a beginning, middle, and end.
Importantly, it was the first game I had written with all three of these
elements.

I kept going.  In subsequent Ludum Dares I didn't always complete a game, but
sometimes I did. And they got better.  This April, my brother Kalev and my
friend Wes wound up placing in the top 100 for the team competition:

<blockquote class="twitter-tweet" lang="en" align="center"><p>Astounded! Placed number 60 overall out of 1004 entries in the Ludum Dare 29 Jam! Our game: <a href="http://t.co/xhbEUFUxXd">http://t.co/xhbEUFUxXd</a> <a href="http://t.co/9FsWtVWWku">pic.twitter.com/9FsWtVWWku</a></p>&mdash; Arne Roomann-Kurrik (@kurrik) <a href="https://twitter.com/kurrik/statuses/468587103870128128">May 20, 2014</a></blockquote>

This sounds ridiculous but it turns out the most important part of being a game
developer is actually making games.  In the years since reading Gurus, I've
started half a dozen exploratory game projects but never got anywhere.  It was
tough to start a long term project from scratch, as the temptation to design
systems, create intense object hierarchies, and learn half a dozen new
frameworks all prevented me from actually making any real progress.

Ludum Dare forced me to cut through all that.  To get something done, I had to
_hustle_, make decisions which resulted in a product _now_.  Almost none of the
code I write is usable in any long-term project, but the ideas and
experimentation are so much more important than that.

The greatest benefit, though, is overcoming the psychological barrier of
_actually getting a product out there_.  I've been the kid who wanted the
immediate gratification of SimAnt over reading a book on game development.
I've been the teenager who read the book but never wrote any code.  I've been
the adult who wrote frameworks but never built a game.

Thanks to Ludum Dare, I have two games I'm really proud of.  I'd love for you
to play them and let me know how they can be better.  Because there will be
more.

  * [Moonshot][2], a space physics game for Ludum Dare 26
  * [Heavy Drizzle][3], a flooding dungeon explorer for Ludum Dare 29
