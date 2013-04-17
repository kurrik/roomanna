[1]: http://www.joelonsoftware.com/articles/LeakyAbstractions.html
[2]: http://www.w3.org/Protocols/rfc2616/rfc2616.html
[3]: http://netcat.sourceforge.net/
[4]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
[5]: http://www.openssl.org/
[6]: https://dev.twitter.com/docs/auth/implementing-sign-twitter

I recently had to debug an issue which required a lot of familiarity with
HTTP to debug.  There were a lot of random workarounds to the problem ("if I
disable feature X it works") but only when a developer clearly articulated
the exact problem with the HTTP response was it possible to trace the error
to a consistent reproduction case.  The underlying lesson is one I've learned
at least a few times now.  When working with web APIs there will be times
where things break at a level where you will be completely helpless unless
you know how things work underneath all of the frameworks, toolkits, and
client libraries in your application.  So learn HTTP, damn it.

<!--BREAK-->

Yes, I know.  Not exactly controversial.  Yet consider the abstraction
that .NET uses to create a HTTP request containing a Basic Authorization header:

    String URL = "http://www.example.com/";
    HttpWebRequest req = (HttpWebRequest)WebRequest.Create(URL);
    req.Credentials = new NetworkCredential(UserName, Password);
    using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
    {
        StreamReader sr = new StreamReader(res.GetResponseStream());
        Console.WriteLine(sr.ReadToEnd());
    }

What exactly is a NetworkCredential?  Certainly nothing defined by the
HTTP spec - it's an abstraction introduced by Microsoft so that
developers can specify a username and password and access protected
resources over HTTP.  Like most abstractions, it makes a specific use
case very easy, at the cost of understanding what the hell is going on
under the covers.  As a method of interacting with HTTP,
it's [leaky as hell][1].

How is any .NET code jockey, furiously copying and pasting from the MSDN
examples, going to understand that the entire point of that code block
is to add a base64-encoded Username:Password HTTP header to the request?
How are they going to understand that the username and password are sent
in plaintext over non-HTTPS requests?  How is that developer going to use
a non-basic Authorization scheme?  How is such a developer going
to know what a HTTP header is?

Lest you think I'm biased (I am, but that's immaterial) I'll say that
this isn't endemic to .NET folks either.  Every day I get support requests
from programmers who should know how this stuff works, but don't seem to
grasp things correctly.  In my experience, poor HTTP abstractions are
typically to blame.  The sad thing is that HTTP is not very difficult
to learn.  Spending some time to cover the fundamentals is well worth it.

Let's hypothesize that I have the magical ability to open a connection to
 any web server, and that every key press I make on my keyboard will be sent
to the remote computer.  I want to get the Google homepage, so I connect to one
of their many web servers.

If the server spoke English, I might type:

    Hello!  Please give me the content located at the path /
    on the domain www.google.com.
    I'm using the Chrome web browser, version 26.
    I would like to receive the content as HTML,
    zipped to save bandwidth,
    in US English,
    with UTF-8 characters (like a snowman ☃).
    This is my only request.

Of course, computers prefer structured data since it's easier to parse.
What HTTP does is give me a way to convey the above information (and more,
if I wanted) in a manner which any HTTP-compatible server will be able to
understand.  In fact, the exact same request is expressed as the following
in version 1.1 of the HTTP protocol:

    GET / HTTP/1.1
    Host: www.google.com
    User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.65 Safari/537.31
    Accept: text/html
    Accept-Encoding: gzip
    Accept-Language: en-US
    Accept-Charset: utf-8
    Connection: close

And that's it!  All I'd have to do is open up my hypothetical program
which would let me type to a web server, type the lines above, and pipe
the response to a file or other destination (probably a decompression utility
since the response would likely be compressed).  The great thing about HTTP is that
it's human-readable.  It's probably as low as one can go in the whole web
stack and still have a chance of constructing a query and response from hand.
Which is, of course, why I think that understanding raw HTTP is still a
reasonable requirement to be expected of any programmer intent on using web
services.

And that hypothetical program which allows me to type out HTTP requests?
It's called [Netcat][3], and it's awesome for testing HTTP servers.
If you're lucky enough
to use a computer with a decent command line, you probably already have this
installed, and if you use Windows, there are ports available too.

If you're on Linux, Unix or OSX, try the following from a command prompt:

    nc maps.googleapis.com 80

That opens a connection to a Google Maps API server on port 80, which is
not-coincidentally, the standard port for HTTP requests.  Everything you type
after pressing enter is sent to the server, and everything sent back is
printed to the console (there is no other output).  Since the server won't send
anything until it gets a request, the ball is in your court.  Copy and paste:

    GET /maps/api/geocode/json?address=San+Francisco,+CA&sensor=false HTTP/1.1
    Host: maps.googleapis.com
    Connection: close

Then press enter twice and watch the magic happen.  You are now
COMMUNICATING WITH MACHINES.  The response will be a JSON-encoded
representation of how Google treats an address of "San Francisco, CA".

You can pretty much play with any URL you'd access in your browser in
this way.   One thing to keep in mind is that if the url begins
with <tt>https</tt> (note the trailing "s") the connection needs to be
encrypted, which Netcat isn't so good at.  Luckily, there's a function in
a utility named [openssl][5] which allows you to do the same thing as
Netcat, but encrypted.  For example, connecting to port 443 (standard
for HTTPS) of a Twitter API server:

    openssl s_client -connect api.twitter.com:443

Then you can issue commands as usual:

    GET /1.1/statuses/show.json?id=119220039382614016 HTTP/1.1
    Host: api.twitter.com
    Connection: close

Note that you'll see an error response - Twitter expects an extra level of
authorization which I won't cover here.  But the concept is very similar,
and once you understand this level of the protocol,
[understanding auth][6] becomes a _lot_ easier.

What you typed into Netcat was practically as simple an HTTP request as you
could make.  There's a wealth of other stuff you could pass, all of which
is specified in [this document, known as RFC2616][2].  It looks crazy but
it's actually pretty understandable if you spend a little bit of time
working through it, particularly sections 5 and 6, which deal with requests
and response structures.  The specification was not meant to be cryptic.
It is supposed to be clear, unambiguous, and implementable.  The
specification is your friend.

