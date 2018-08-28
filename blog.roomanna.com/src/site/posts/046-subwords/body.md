[script]: https://github.com/kurrik/code/blob/master/subwords/main.go
[12dicts]: http://wordlist.aspell.net/12dicts/

As is pretty common at SF tech companies, lots of people at Stripe have laptop
stickers with various company logos (including our own) on them.  So there have
been at least a few cases where I've sat in a meeting, maybe slightly
distracted, facing a laptop with the word STRIPE on it, and let my mind wander.
And where it tends to go is to the observation that there's lots of _other_
words inside of STRIPE.  STRIP is a word, TRIPE is a word, TRIP is a word, and
RIPE is a word.  There are valid words all up in this thing!  And then I tend
to think two very specific questions:

- How many subsets of the word STRIPE are valid dictionary words?
- What's the English word which has the highest percentage of its subsets be
  valid dictionary words?

I've thought these questions far too often.  And so in the interest of
self-discovery, growth, and hopefully moving on to other useless things to
think about, I decided to find some answers.

<!--BREAK-->

Like many things I do, I started by [writing an inefficient script][script].
This one does the following:

- Loads a dictionary into memory.
- Iterates over every word.
- For a given word, finds all the subsets of the word.
- Checks those words against the dictionary, keeping track of the valid count.
- Sorts all the dictionary words in a deterministic order, first by percent of
  valid words out of all possible subsets, then in case of ties by raw valid
  word count (most valid words wins), finally alphabetically if the other two
  values are equal.

For a dictionary, I used [12Dicts][12dicts], which I've used in the past and
generally seems to do well when you need a list of valid, recognizable words.
Other "top 5000" word lists have too few words, and other words have a ton of
garbage in them.  This worked well, but doesn't contain single letter words, so
I added "A" and "I" because I felt that those should count.

I expected that I might need to optimize the script as I thought it would take
long to run, but against the 80k word dictionary it ran fast enough that I
didn't have any problems waiting for results.  So I don't get to show off any
clever algorithm work, but I also didn't waste any more time than I already did
writing the thing in the first place, then writing this post up which maybe 5
people other than me will ever read.

The script has a mode where it will print out the results for a single word.  I
verified things were working well, and immediately ran it for STRIPE:

```
$ ./run.sh 2of12inf.txt test stripe
Words read 81885
# stripe:
-                                        e: invalid
-                                        i: valid
-                                       ip: invalid
-                                      ipe: invalid
-                                        p: invalid
-                                       pe: invalid
-                                        r: invalid
-                                       ri: invalid
-                                      rip: valid
-                                     ripe: valid
-                                        s: invalid
-                                       st: invalid
-                                      str: invalid
-                                     stri: invalid
-                                    strip: valid
-                                        t: invalid
-                                       tr: invalid
-                                      tri: invalid
-                                     trip: valid
-                                    tripe: valid
stripe, 6/20 valid (30%)
```

To be honest, 30% was lower than I expected!  By my ranking heuristic, #7245 /
81885.  Top 10%, but not even in the top 1000!

```
7242.) sticky, 6/20 valid (30%)
7243.) stingy, 6/20 valid (30%)
7244.) stoney, 6/20 valid (30%)
7245.) stripe, 6/20 valid (30%)
7246.) suitor, 6/20 valid (30%)
7247.) swathe, 6/20 valid (30%)
7248.) tailor, 6/20 valid (30%)
```

What are the top words by this ranking?  I won't keep you on the edge of your
seat much longer.  They are:

```
$ ./run.sh 2of12inf.txt all stripe -count=10000
Words read 81885
 0.) hash, 6/8 valid (75%)
 1.) aha, 3/4 valid (75%)
 2.) hah, 3/4 valid (75%)
 3.) tit, 3/4 valid (75%)
 4.) maxis, 10/14 valid (71.43%)
 5.) hashes, 12/18 valid (66.67%)
 6.) amid, 6/9 valid (66.67%)
 7.) awed, 6/9 valid (66.67%)
 8.) axis, 6/9 valid (66.67%)
 9.) lash, 6/9 valid (66.67%)
10.) mash, 6/9 valid (66.67%)
11.) maxi, 6/9 valid (66.67%)
12.) hawed, 9/14 valid (64.29%)
13.) pawed, 9/14 valid (64.29%)
14.) taxis, 9/14 valid (64.29%)
15.) yawed, 9/14 valid (64.29%)
16.) lashes, 12/19 valid (63.16%)
17.) mashes, 12/19 valid (63.16%)
18.) spares, 12/19 valid (63.16%)
19.) dado, 5/8 valid (62.5%)
20.) lama, 5/8 valid (62.5%)
21.) lass, 5/8 valid (62.5%)
22.) mass, 5/8 valid (62.5%)
23.) pass, 5/8 valid (62.5%)
24.) shah, 5/8 valid (62.5%)
25.) spas, 5/8 valid (62.5%)
26.) tits, 5/8 valid (62.5%)
27.) ashes, 8/13 valid (61.54%)
28.) dados, 8/13 valid (61.54%)
29.) lamas, 8/13 valid (61.54%)
30.) shits, 8/13 valid (61.54%)
...
```

OK!  HASH is the top word, with an impressive six out of eight subwords
appearing in the dictionary:

```
$ ./run.sh 2of12inf.txt test hash
Words read 81885
# hash:
-                                        a: valid
-                                       as: valid
-                                      ash: valid
-                                        h: invalid
-                                       ha: valid
-                                      has: valid
-                                        s: invalid
-                                       sh: valid
hash, 6/8 valid (75%)
```

[scrabble-dict]: https://scrabble.hasbro.com/en-us/tools#dictionary

I wasn't completely sure whether SH should count, but it's apparently [valid in
Scrabble][scrabble-dict] (and worth 5 points!) and defined as: USED TO URGE
SILENCE.  In fact, now that I'm thinking about Scrabble, these words might be
great candidates to spell out slowly, as I think you can build them up over
multiple turns and get more points.

So there you have it!  How many subsets of the word STRIPE are valid dictionary
words?  30%. What's the English word which has the highest percentage of its
subsets be valid dictionary words? HASH.  Hope you learned something!  I sure
did!
