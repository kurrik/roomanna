This update has been a long time coming.  Sometime around October 2011 I
decided that I would convert this blog to a Bootstrap-based layout, wound
up breaking everything with my build process, and decided that the best way
to fix things was to rewrite Jekyll from scratch, using Go.

It is now December 2012 and this plan has come to fruition.

<!--BREAK-->

I hope to cover all of this in more detail in future updates, but these are
the major components I wrote at various points during the previous 15 months:

## Fauxfile
A filesystem wrapper for Go, which offers a mock implementation that may
be used for unit testing.  Available at
[github.com/kurrik/fauxfile](https://github.com/kurrik/fauxfile).

## Ghostwriter
A blog generation utility which has been heavily influenced by Jekyll.
Depends on fauxfile, and acts as a "real world" customer of that library.
Available at
[github.com/kurrik/ghostwriter](https://github.com/kurrik/ghostwriter).

## Roomanna
The blog itself, finally redesigned to use Bootstrap.  The server itself
went from a lightweight Python server to a lightweight Go server,
available at
[github.com/kurrik/roomanna/blog.roomanna.com/server](https://github.com/kurrik/roomanna/tree/master/blog.roomanna.com/server).

During the time that the site was out of order, I kept writing drafts for
posts which simply had no place to be published, so there's a queue of
content I'll start polishing and posting up here.
