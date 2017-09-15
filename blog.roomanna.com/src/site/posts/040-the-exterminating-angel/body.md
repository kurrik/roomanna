[imdb]: http://www.imdb.com/title/tt0056732/
[alphaville]: https://www.criterion.com/current/posts/38-alphaville
[primer]: http://io9.gizmodo.com/5847205/the-definitive-graph-of-all-of-primers-intersecting-timelines
[ebert]: http://www.rogerebert.com/reviews/great-movie-the-exterminating-angel-1962
[guardian]: https://www.theguardian.com/music/2017/apr/01/thomas-ades-opera-exterminating-angel-bunuel-jonathan-romney
[criterion]: https://www.criterion.com/current/posts/1012-the-exterminating-angel-exterminating-civilization
[foster-wallace]: http://www.badgerinternet.com/~bobkat/rose.html
[blue-velvet]: http://www.imdb.com/title/tt0090756/
[stalker]: {{ link "030-stalker" }}

The premise for Luis Buñuel's [THE EXTERMINATING ANGEL][imdb] is that a group
of socialites are unable to leave a parlor following a dinner party.  This is
about as much as I knew going into it, which was exciting, since the premise
works better that way.

I figure that if you're going to keep people in a room there's a few ways it
can go.  The most obvious is that the room is literally locked or blocked off
and those folks need to escape it physically.  In this case that seemed
unlikely, mostly because the movie is named The Exterminating Angel and that
would be a pretty bad name for a movie about a locked room.

<!--BREAK-->

Another option is that it could be about some kind of supernatural force that
the people need to overcome.  My general hope was that The Exterminating Angel
wouldn't go this way. Arthouse films in the 60s didn't tend to have great
special effects budgets (I'm looking at you, [Alphaville][alphaville]) and I
felt that this film would easily get to a point where someone was doing some
kind of terrible mime-in-a-box routine which I didn't want to see.

What I _was_ hoping for was that it would be a really really tight clockwork
movie.  A movie where every time someone wanted to leave some kind of accident
or distraction occurred without making it obvious to the characters what was
going on.  I wanted the logic to be intricate and consistent.  I wanted to
finish watching it and feel like it was far smarter than me.  (Essentially, I
wanted [Primer][primer]).

The Exterminating Angel isn't that, of course.  But it handles a great
transition from literal to supernatural without delving into absurdities.  It
sells you on the premise and when you're bought in, it freely explores the
implications of the world it builds.  In a way, it's almost like an inverted
[Stalker][stalker] (theme movie night idea: people trying to either get into
or out of rooms). It's a confident, entertaining and beautifully shot movie.

{{define "imagedata"}}
exterminating_angel:
  Image: {{imagemeta "exterminating-angel.jpg" | tojson}}
  Alt: "Still from The Exterminating Angel"
{{end}}

{{define "image"}}
  <p class="centered"><img width="{{.Image.Width}}" height="{{.Image.Height}}" src="{{.Image.Path}}" alt="{{.Alt}}" /></p>
{{end}}

{{template "image" (yamltemplate "imagedata").exterminating_angel}}

There's a lot of good discussion about the meaning of the film.  It's either an
allegory about the [ruling class in Francoist Spain][ebert], a [Ballardian
apocalyptic society, a desert island story][guardian] or the [breakdown of
Western civilization][criterion] (this last link - an analysis by Marsha Kinder
is excellent, very much worth a read).

Personally, the deepest meaning I saw was a criticism of rituals.  Opera
nights, dinner parties, kabbalah, defecation, sex, suicide, religion are all
presented with an uncomfortable formality and basically lead nowhere.  Even the
means of escaping the room is a self-reflexive ritual which feels suspiciously
like it didn't actually work.  Throughout the film, there are various visual
tricks and repeated scenes which make me want to fall into a deeper ritual of
analysis but I suspect that this too, is a trap and that ultimately very
little of it makes a formal sense.

What really resonates with me is a completely unrelated [quote from David Foster
Wallace][foster-wallace] about watching [Blue Velvet][blue-velvet] I came
across the week after watching The Exterminating Angel.  I think it applies
equally as well here.

<blockquote>
  <p>
    "Blue Velvet" is a type of surrealism -- it may have some -- it may have
debts.  There's a debt to Hitchcock somewhere. But it is an entirely new and
original kind of surrealism. It no more comes out of a previous tradition or
the post-modern thing. It is completely David Lynch. And I don't know how well
you or your viewers would remember the film, but there are some very odd --
there's a moment when a guy named "the yellow man" is shot in an apartment and
then Jeffrey, the main character, runs into the apartment and the guy's dead,
but he's still standing there. And there's no explanation. You know, he's just
standing there. And it is -- it's almost classically French --
Francophilistically surreal, and yet it seems absolutely true and absolutely
appropriate.
  </p>
  <p>
  And there was this -- I know I'm taking a long time to answer your question.
There was this way in which I all of a sudden realized that the point of being
post-modern or being avant garde or whatever wasn't to follow in a certain kind
of tradition, that all that stuff is B.S. imposed by critics and camp followers
afterwards, that what the really great artists do -- and it sounds very trite
to say it out loud, but what the really great artists do is they're entirely
themselves. They're entirely themselves. They've got their own vision, their
own way of fracturing reality, and that if it's authentic and true, you will
feel it in your nerve endings. And this is what "Blue Velvet" did for me.
  </p>
</blockquote>
