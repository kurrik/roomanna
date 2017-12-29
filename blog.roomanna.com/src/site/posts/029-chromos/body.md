On April 17, 2015, Wes, Kalev and I started work on LD32, our third
collaboration on a [Ludum Dare]({{link "026-ludum-dare"}}) weekend game jam.

Our resulting entry, [Chromos](http://eg.regio.us/ld32), is a top-down action
game reminiscient of Zelda and (blatantly) Titan Souls.  It's the most
ambitious game we have tried to make in 48 hours:

<iframe class="centered" width="420" height="315" src="https://www.youtube.com/embed/3xs_6vkWYxc" frameborder="0" allowfullscreen></iframe>

<!--BREAK-->

Truthfully, it was also the hardest to design and work on.  Whereas earlier
projects like Moonshot or Heavy Drizzle felt like we all knew exactly what we
were building, I certainly didn't have an idea of what the actual _game_ would
be until about halfway into the weekend.

The team's first reaction to the "An Unconventional Weapon" theme was pretty
negative.  The theme sounds really cool but was limiting in ways we really
didn't want to be limited.  The biggest obstacle in my mind was that it pretty
much forced us to have a weapon, which we had avoided in the past by making
puzzle or exploration based games.

<div class="centered">
  {{template "image" (.Image "slack_theme_hate")}}
  <div class="caption centered">The team hates on the theme in our Slack channel</div>
</div>

When I'm working on such a tight timeframe, trimming early and aggressively is
my favorite way to stay on track.  We always trimmed enemies from our previous
games because they require a ton of work.  Each enemy type needs animations,
(minimally idle, walking, and attacking) for every direction they can face.
Enemies typically need AI and pathfinding too&mdash;one of my first LD solo
projects was a Bomberman clone.  I didn't have time to implement AI or
pathfinding and just made the baddies roll a die to walk up, down, left, right,
or drop a bomb.  In that case, each enemy blew itself up in the first few
seconds and the game was no fun at all.

The dirty secret about Ludum Dare is that if you want to do well, you should do
a bunch of pre-planning for the weekend, including deciding on the type of game
you want to make.  So before LD32, we figured that making another top-down
Zelda-like exploration game would be fun.  I tuned
[twodee](https://github.com/kurrik/twodee), our game library, to be able to
handle big maps, and added a couple of interesting features such as the ability
to shake the camera (a tribute to [Titan
Souls](http://www.devolverdigital.com/games/view/titan-souls)), draw lines, and
have an in-memory grid representation of the map for the purposes of
pathfinding.

<p class="centered">
  {{template "image" (.Image "ld32_01_360")}}
  <div class="caption centered">An early tech demo of the twodee engine</div>
</p>

Once the theme for LD is announced, we always spend an hour coming up with a
plan of what to build.  But as the hour for LD32 ran out, we still didn't know
what the mechanic for the game would be.  We figured we'd just start working on
something Zelda-like and maybe the idea would come to us.

Titan Souls has the setup that the entire game is just a series of boss fights
and there's no enemies on the map itself.  This is a bit of aggressive trimming
(Titan Souls was initially a Ludum Dare game) and works out brilliantly.  The
main map is abandoned and moody, and the developers put all their time into
making the boss fights fun.  We figured we could do the same&mdash;if we were
going to go ahead and make interesting enemies it would be more rewarding to
have a few different big boss enemies and not have to worry about a bunch of
things wandering around the map.

From that point, we had a ton of work to do just to get a map loading and an
animating character running around (twodee isn't the most streamlined yet), so
I let Future Arne worry about the theme and set to work implementing various
controls and simple collisions (something which should have been in twodee
beforehand).

<blockquote align="center" class="twitter-tweet" lang="en"><p lang="en" dir="ltr">Collisions took longer than I wanted. Feels solid though. Updated engine lib so I don&#39;t need to do this again <a href="https://twitter.com/hashtag/LDJAM?src=hash">#LDJAM</a> <a href="http://t.co/Et1I4Ln5a8">pic.twitter.com/Et1I4Ln5a8</a></p>&mdash; Arne Rಠ_ಠmann-Kurrik (@kurrik) <a href="https://twitter.com/kurrik/status/589545216421429248">April 18, 2015</a></blockquote>

By the end of Friday, I must have been despairing a bit, as my Tweets all
called out the lack of direction:

<blockquote align="center" class="twitter-tweet" data-cards="hidden" lang="en"><p lang="en" dir="ltr">About 7 hours in &amp; a cohesive plan of what we&#39;re building hasn&#39;t gelled yet. Lots of ideas and wants, worried about lacking vision <a href="https://twitter.com/hashtag/LDJAM?src=hash">#LDJAM</a></p>&mdash; Arne Rಠ_ಠmann-Kurrik (@kurrik) <a href="https://twitter.com/kurrik/status/589340743958810624">April 18, 2015</a></blockquote>
<blockquote align="center" class="twitter-tweet" data-cards="hidden" lang="en"><p lang="en" dir="ltr">Lots of engine work without a plan though. Top down adventure, added animations &amp; roll &amp; screen shake <a href="https://t.co/Q5lihsTlsn">https://t.co/Q5lihsTlsn</a> <a href="https://twitter.com/hashtag/LDJAM?src=hash">#LDJAM</a></p>&mdash; Arne Rಠ_ಠmann-Kurrik (@kurrik) <a href="https://twitter.com/kurrik/status/589341161313079297">April 18, 2015</a></blockquote>
<blockquote align="center" class="twitter-tweet" data-cards="hidden" lang="en"><p lang="en" dir="ltr">Off to bed shortly. Would have liked a core mechanic implemented today but good progress on the engine. Maybe sleep will give ideas <a href="https://twitter.com/hashtag/LDJAM?src=hash">#LDJAM</a></p>&mdash; Arne Rಠ_ಠmann-Kurrik (@kurrik) <a href="https://twitter.com/kurrik/status/589342245922320384">April 18, 2015</a></blockquote>

I typically find that if I go to bed thinking about a problem, I can wake up
the next morning with a solution.  Not this time, though.  I woke up and got
some productive engine work done on Saturday but the harder I thought about
what would make the game interesting, the less I came up with.

Until, like Archimedes before me, I took a break from the problem at hand for
some light bathing and was struck by insight:

<blockquote align="center" class="twitter-tweet" lang="en"><p lang="en" dir="ltr">Took a shower at 24 hours in and had a Eureka! moment with the mechanic. Color is the weapon <a href="https://twitter.com/hashtag/LDJAM?src=hash">#LDJAM</a> <a href="http://t.co/iijWmB329k">pic.twitter.com/iijWmB329k</a></p>&mdash; Arne Rಠ_ಠmann-Kurrik (@kurrik) <a href="https://twitter.com/kurrik/status/589618599960023040">April 19, 2015</a></blockquote>

My idea was that instead of having an unusual sword-substitute, the character's
weapon would be the ability to change the color of the scene.  Each boss would
have a magic color which would inflict damage, so once the player figured out
the correct color combination, the boss would take damage and the magic color
would change.

What I really liked about this idea was that it let me play around with
effects.  Shaders were initially tricky to learn but now that I've wrapped my
head around the concepts they've become one of my favorite parts of game
development.  In this case, coloring the scene was a really fast addition and
we were able to get a proof of concept with some initial art together by
Saturday night.

<p class="centered">
  {{template "image" (.Image "ld32_13_360")}}
</p>

<p class="centered">
  {{template "image" (.Image "ld32_14_360")}}
</p>

I also finally bit the bullet and did the animations for the boss character.
Originally I was thinking we'd have multiple bosses but I completely ran out of
time.  In fact, I knew I only had enough time to do one set of animations, so I
used combinations for the same set of frames for idle, moving, attacking, and
dying.  I also made the boss a symmetrical jelly cube so that I wouldn't have
to worry about making it face different directions.  Hacky, but I like the way
it turned out (hopefully evocative of D&amp;D):

<p class="centered">
  {{template "image" (.Image "boss")}}
</p>

A quick modification to the effects shader let me change the color of the
center circle to any arbitrary color.  So the game is able to display what the
boss's magic color is and give you a hint about the colors you need to combine
to damage it.

During this time, Wes was working on the boss pathfinding and UI.  This is very
hard to get right, so I was happy he was able to focus on it.  We wound up
needing to add a debug mode to the game which would show the boss's pathfinding
algorithm at work (good thing I put the ability to draw lines into the
engine!).  Being able to visualize algorithms in action is another great thing
about game development - you can typically just draw more information on a
scene in debug mode and get an intuition about any weird behavior you see.

<p class="centered">
  {{template "image" (.Image "ld32_16_360")}}
</p>

Eventually the pathfinding was good enough, and I had put in the stuff to make
it a real game - the ability to win, the ability to lose, and splash screens
which showed up whenever either of those things happened.

<p class="centered">
  {{template "image" (.Image "ld32_17_360")}}
</p>

At the end of the day, we shipped our first game with an enemy.  It's not our
best game&mdash;we wound up placing 374/1468 overall, which is our worst
showing to date.  But like everything else we've done so far, I like the
mechanic, I'm proud of getting it done, and I feel like the idea has potential
should we want to pick this up again and work on something similar.

I'm not sure if there's much of a moral to this development log.  Making games
is hard, especially if you don't have a strong inspiration.  Ludum Dare's
themes have historically helped us focus our efforts but I feel like this one
got in the way a bit.  Personally, I feel like I learned at least a few more
things:

1. It's very difficult to juggle game design, programming, and art. It would
have been better to have had a dedicated artist or scope down the art into
basic geometric shapes.  I think of this game as pretty (at least for my own
art skills!) but not fun.  I think I'd rather have had fun but not pretty.

1. Taking breaks to get up, move around, and focus on something else briefly
can be hugely productive.

1. We would have benefitted greatly by tuning the boss behavior more - they
just follow you around or give up if you get too far away.  State machines
should be easier to build in twodee.

1. Taking the theme too literally can make building the game too much of a
slog.  As an example, the [Jam
winner](http://ludumdare.com/compo/ludum-dare-32/?uid=50449) had a brilliant
take on the theme without needing a ton of AI or violence.  Figuring out the
simplest possible mechanic early on and focusing on making it fun seems like
the right way to go.

If you're interested in playing Chromos, you can download it from [this
page](http://eg.regio.us/ld32).  You can also see a collection of all my Tweets
from the development in this [Twitter
Timeline](https://twitter.com/kurrik/timelines/619916886046683136) which shows
a bunch more images and animations from the development of the game.

Can't wait until the next one!
