[url-ludum-dare-twitter]: https://twitter.com/kurrik/timelines/619916886046683136
[url-spleunky]: https://bossfightbooks.com/products/spelunky-by-derek-yu
[url-john-cleese]: https://www.youtube.com/watch?v=Pb5oIIPO62g
[url-itch]: https://itch.io/jams

The first time I remember hearing the term "hackathon" out loud was when I was
a couple weeks into my employment on Google's Developer Relations team. I was
trying to figure out what I was going to do to help bootstrap developers for
the nascent OpenSocial project.  Patrick Chanezon, the Developer Advocate on
the project, said something like "we're going to cold call a bunch of social
app authors and hold a hackathon to test out the API" which hadn't really been
done before&mdash;we were helping pave a new path for the company at the time.
That first event was kind of a mess.  I remember stalling for time with a room
full of developers since our test server wasn't booting correctly. An engineer
was hurriedly trying to fix things so that the attendees could get to work.

<!--BREAK-->

"Hackathon", "code jam", or "hack week" events are far more common now.
Invites regularly accompany developer announcements and conferences.  Stripe,
Twitter, and Google have all held internal hackathons to test APIs and
prototype new ideas.  I was lucky enough to visit The Guardian and give a
lightning talk at one of the newspaper's internal hackathons.  The indie game
hosting site itch.io has a [somewhat-overwhelming list][url-itch] of all the
game jams they host for their community.  Of the hundreds of game-related
hackathons a year, I [tend to participate][url-ludum-dare-twitter] in a 48-hour
game jam named Ludum Dare.

The idea: sit in a room and work like mad on a one-off idea with a tight
deadline and throwaway code.  It's an attractive concept to me. When I start a
hackathon, I feel energized. It's a potent combination of building something
new, finishing something soon, and never having to worry about maintaining the
output. The ideal hackathon puts me in a state where I keep a map of everything
related to my program in short-term memory.  Every challenge is surmounted with
the ugliest, cleverest hack I can muster.  Once that state is gone I can't go
back to the code I wrote&mdash;it's poison; radioactive.  But generally (if I'm
successful) my program satisfies the task I brought it into the world to do.

Through such events I've been able to prototype a wide range of ideas which I
never would've implemented otherwise. The weird contradiction is that I tend to
complete more things in the short time frame because I'm focused on shipping
and not worrying about architecture, maintainability, tests, or code
cleanliness.  Shipping things is a skill in its own, and one that we don't get
to practice very often. One of my favorite books I read last year was Derek
Yu's notes and analysis of developing the game [Spleunky][url-spleunky].  There
are lots of fantastic insights into product development in that book but his
discussion on finishing has been especially memorable to me:

<blockquote>"finishing is a skill as much as being able to design, draw, program, or
make music, and that finished projects are more valuable than unfinished
projects. Most creative people are familiar with the first part of making
something, and it’s easy to mistakenly assume that the rest is just more of the
same. It’s akin to repeatedly climbing the first quarter of a mountain and
thinking that you’re getting the experience you need to summit. Or running a
few miles and thinking that you can run a marathon. In truth, the only way to
learn how to summit mountains, run marathons, and finish making games is to
actually do those things."</blockquote>

Hackathons provide ideal conditions for practicing finishing but there are
other, broader benefits too.  At work, they can be used to answer some
important questions.  What are creative ways to combine the primitives the team
is building?  How usable is the API? What small features might be interesting
but never be prioritized onto the roadmap?  Hackathons can be the opportunity
to show the potential of an idea with a real implementation.  I tend to find
that they also generate ideas: ways to structure projects for faster iteration,
areas which could benefit from less boilerplate, ways to increase the
composability of components and so on.

That's not to say that all hackathons are effective in realizing these
benefits.  There are a few attributes which I think are important to a
successful event.  The first is that there should be no concept of a "winner".
Twitter used to promise rewards such as permanently staffing the project which
got the most votes.  I felt that this incentivized the wrong thing.  Some teams
would prepare for months in advance and game the voting system by working on
popular but less impactful ideas.

The ultimate goal of a hackathon should be to get as many demos as possible by
the end.  But I don't like voting on these.  I believe voting systems cause
people to self-select out of presenting if they think their project is not a
viable candidate to win.  A team I worked on had a weekly demo where anyone who
presented had an equal chance at winning a $100 gift card.  This decoupled the
incentive to game a voting system but still encouraged participation,
especially on weeks where participation was light ("only three people demoed
today, I should present something since my odds are so good").  I like this
model and have seen it used successfully for hackathons too.

My second necessary attribute for a successful event is a set of constraints.
Without these, the tendency seems to be to attempt too-ambitious work with too
many features or too much polish needed to sell an idea. The most significant
constraint (and one included by default) is simply time.  Whatever duration you
pick won't be enough, but keep in mind that the goal of the hackathon should be
to sell an idea and to practice finishing.  Cutting scope, setting realistic
deadlines, finding the minimum viable product are all things hackathon
attendees should be practicing.

For workplaces, I like setting a hard start and a hard stop every day.  I've
seen many "crunch night" events where employees are encouraged to stay late,
eat takeout, miss out on their families in favor of getting more stuff done.
Working longer hours isn't fair to those who have lives and obligations outside
of the company and lessens the need to practice time management.  "We're
behind, but we'll just work late on Thursday to finish" is a failure mode in my
eyes.

That's not to say that crunch isn't useful, but it should be moderated.  Ludum
Dare is 48 hours long and the only effective way to get to a prototype is to
work as much of that time as possible.  But crunching from 6pm Friday still
lets me sleep early on Sunday and come into work on Monday.  I've even taken to
scheduling two five-hour sleep sessions (20% of the total time!) as I've
realized this amount of rest produces a net benefit over working tired for two
days straight.  I'm getting older, and more than two days of crunch burns me
right out.  I'm barely usable for days afterward.

Paradoxically, shipping something outside of normal work can be energizing. The
last week-long hackathon I ran had a hard start at 9am and hard stop at 5pm.  I
told people go home if I saw them working late.  The demos at the end of the
week were really great!  The attendees made excellent choices on what to focus
on given the time constraints.  The following week they were able to go back to
what they were working on, energized from the creative flow the temporary break
allowed rather than burned out from a week of crunch.

An effective constraint is a randomly-selected theme.  Ludum Dare announces its
theme right at the start of the 48 hour period.  Adherence to the theme is a
scoring metric for submitted games.  Themes tend to have a maddeningly vague
yet constrictive feel. The last few have been "The more you have, the worse it
is", "Running out of Power", "A Small World", "One Room", "Ancient Technology"
and so on.  Use of this constraint discourages prework: the games which tend to
do well typically have interesting takes on the theme which are integrated in a
deep way.

When unconstrained, I find myself working on projects which have been bugging
me for a while&mdash; fixit tasks rather than innovative things. I tend to pick
the first thing which I might have wanted to do for a while. But I tend to feel
more creative during Ludum Dare.  Originally I thought this was just because
games were creative endeavors but this [wonderful talk on the subject of
creativity][url-john-cleese] by John Cleese hypothesizes that creative people
may simply linger on problems longer. They play with many solutions before
accepting one. This playfulness is eliminated when people work on pet projects
they've scoped out long in advance, or simply pick something off of the backlog
to work on. So Ludum Dare's theme forces me to consider multiple ideas which
match the theme.  At the start of LD I budget no less than an hour (2% of the
total time!) to brainstorm before writing any code. Sometimes the second,
third, or fourth idea winds up being the best.

In summary, I'm very positive on the beneficial effects a well-run hackathon
can bring.  Perspective, demos, and a chance to practice infrequently used
skills.  (Just make sure the test server is working!)
