[link-1]: http://blog.golang.org/2011/05/go-and-google-app-engine.html
[link-2]: http://golang.org
[link-3]: https://github.com/kurrik/appengine-samples/tree/master/go-echo
[link-4]: https://github.com/kurrik/appengine-samples/blob/master/go-echo/app.yaml
[link-5]: https://github.com/kurrik/appengine-samples/blob/master/go-echo/echo/echo.go
[link-6]: http://code.google.com/appengine/docs/go/gettingstarted/helloworld.html
[link-7]: https://github.com/kurrik/appengine-samples/blob/master/go-echo/Makefile
[link-8]: http://www.adequatelygood.com/2010/2/JavaScript-Scoping-and-Hoisting
[link-9]: http://golang.org/doc/effective_go.html#if
[link-10]: http://golang.org/doc/effective_go.html#semicolons
[link-11]: http://stackoverflow.com/questions/3516357/are-there-any-go-librarys-that-provide-associative-array-capability

Like I’ve said before, I think the news that [Go will be supported on App
Engine][link-1] was my favorite of announcement of I/O this year.   I think
this is a huge step in getting broader developer support for [Go][link-2] as
well as giving a comfortable middle ground between Python and Java for
developers who want their App Engine apps to be compact and flexible while
retaining some ability to do static analysis and refactoring.
<a href="{{link "008-simple-go-server"}}#note">*</a>

<!--BREAK-->

{{template "image" (.Image "gogopher-right")}}

But at this point I’m still a wannabe Go fanboy.  I hadn’t actually sat down
and written a service in the language until a few days ago, when I got a Chrome
Extension help request that involved the use of a web server.  I wanted to
write a blog post about the answer but needed a simple server to mock responses
back to the extension.  So I wrote the service in Go. I’ll talk more about the
extension in a later post, but wanted to cover my experience writing the server
first.

*(At this point I'll say that I'm certainly not at the point where I'm going to
be sharing best practices.  If you see anything that looks funny, please leave
a comment and I'll update things to work better)*

Writing a simple server is quite easy.  My [echo server project][link-3]
consists of 2 files:
* [app.yaml][link-4]
* [echo/echo.go][link-5]

## app.yaml

This is the metadata file that all App Engine apps use to declare information
about their service.  Mine is:

<pre class="brush:yaml">
application: echo
version: 1
runtime: go
api_version: 1

handlers:
- url: /.*
  script: _go_app
</pre>

Which is really direct.  The only major differences from a Python project are
that the runtime is “go” and that you don’t specify individual files for the
handlers.  The `_go_app` syntax appears to be a catch-all because url handlers
are actually registered inside of the source files themselves.  I like this -
it helps reduce a bit of the duplication that you’d get in a Python project
(where routes in `app.yaml` are mapped to handlers, but you still need to
specify routes in the source).

Apparently if I wanted to serve static content, I could just insert the
appropriate entries above the `/.*` declaration and that would all work just
like a Python project.

## echo/echo.go

All the real work is done here.  A minimal Go server imports the `http`
package, assigns a handler to a route, and handles input/output in the handler.
Even though I’m not really familiar with Go’s syntax, the [minimal example from
the tutorial][link-6] is understandable:

<pre class="blockquote">
package hello
import (
    "fmt"
    "http"
)
func init() {
    http.HandleFunc("/", handler)
}
func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello, world!")
}
</pre>

I wanted my echo server to print back the contents of a form-POSTed variable,
so first step was to define the form.

<pre class="brush:go">
package echo

import (
  "http"
  "fmt"
)

func init() {
  http.HandleFunc("/", formhandler)
}

func formhandler (w http.ResponseWriter, r *http.Request) {
  fmt.Fprint(w, `&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;body&gt;
    &lt;form method=&quot;POST&quot; action=&quot;/dest&quot;&gt;
      &lt;input type=&quot;text&quot; name=&quot;content&quot; placeholder=&quot;Put content here&quot; /&gt;
      &lt;button&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  &lt;/body&gt;
&lt;/html&gt;`)
}
</pre>

Easy enough.  The only thing new there was to figure out that backticks allow
multi-line string literals in Go.

Next, I needed to display the posted data on the destination page.  I figured
templating would be needed to display (and sanitize!) any input values.
Thankfully, Go’s standard library already has a ton of functionality, and
includes a `template` package.

I added the package to the imports:

<pre>
import (
  "http"
  "fmt"
  <strong>"template"</strong>
)
</pre>

Registered a new handler:

<pre>
func init() {
  <strong>http.HandleFunc("/dest", posthandler)</strong>
  http.HandleFunc("/", formhandler)
}
</pre>

And created the template:

<pre>
func formhandler (w http.ResponseWriter, r *http.Request) {
  fmt.Fprint(w, `&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;body&gt;
    &lt;form method=&quot;POST&quot; action=&quot;/dest&quot;&gt;
      &lt;input type=&quot;text&quot; name=&quot;content&quot; placeholder=&quot;Put content here&quot; /&gt;
      &lt;button&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  &lt;/body&gt;
&lt;/html&gt;`)
}

<strong>var postTemplate = template.MustParse(postTemplateHTML, nil)
const postTemplateHTML = `
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;body&gt;
    &lt;pre&gt;{Content|html}&lt;/pre&gt;
    &lt;p&gt;{Seconds}&lt;/p&gt;
    &lt;a href=&quot;http://{Host}/&quot;&gt;Back&lt;/a&gt;
  &lt;/body&gt;
&lt;/html&gt;`</strong>
</pre>

(Interestingly, the example code in the Go documentation shows using
`postTemplateHTML` before declaring it, so there must be some sort of hoisting
going on.  I’ll have to look into this a bit further - in JavaScript [this kind
of behavior][link-8] can lead to some unexpected bugs.)

Since I was using a template, I could put placeholders for data I wanted to
render.  For example, `{Content|html}` will print the variable `Content`’s
value in an HTML-sanitized manner.  Cool.  I also put in some placeholders for
data I will get from the environment, such as current time and request host.

The handler takes care of rendering the template:

<pre class="brush:go">
func posthandler (w http.ResponseWriter, r *http.Request) {
  data :=  …  // I’ll get to this in a second

  if err := postTemplate.Execute(w, data); err != nil {
    http.Error(w, err.String(), http.StatusInternalServerError)
  }
}
</pre>

The `if` statement syntax is a bit unique to Go (as far as I know).  From the
[documentation][link-9]:

<pre class="blockquote">
if and switch accept an optional initialization statement like that of for
</pre>

So that saves a line, and the `err := foo; err != nil` practice seems to be
pretty standard, from looking at the code samples.  (In Go, `:=` is an
initializing declaration - kind of like Pascal)

Originally, I thought the semicolon in the if statement was for some sort of
AND operator, which was incorrect.  Go actually *does* use semicolons to
[terminate statements][link-10]:

<pre class="blockquote">
Like C, Go's formal grammar uses semicolons to terminate statements;
unlike C, those semicolons do not appear in the source.
</pre>

So in cases where more than one statement is supported for an operator (such as
`if` or `for`), an explicit semicolon needs to be inserted.

The last bit I needed to do was figure out how to actually pass named template
data into the `template.Execute` method.  In the snippet above, I’ve got a
placeholder variable data which needs to contain values for `Content`,
`Seconds`, and `Host` template placeholders.  My first instinct was to create a
struct:

<pre class="brush:go">
type PostData struct {
  Content string // post content
  Seconds int64  // timestamp
  Host string    // hostname
}
</pre>

Add the time package to get access to the current time:

<pre>
import (
  "http"
  "fmt"
  "template"
  <strong>"time"</strong>
)
</pre>

And then create an instance of the struct in the `posthandler` function:

<pre>
func posthandler (w http.ResponseWriter, r *http.Request) {
  <strong>data := PostData {
    Content: r.FormValue("content"),
    Seconds: time.Seconds(),
    Host: r.Host,
  }</strong>

  if err := postTemplate.Execute(w, data); err != nil {
    http.Error(w, err.String(), http.StatusInternalServerError)
  }
}
</pre>

This actually worked fine (once I realized that lowercased struct property
names are considered private and capitalized the names I wanted to reveal to
the template).  But the approach felt a bit confining - if I wanted to add or
remove data sent to the template, I’d have to modify the struct declaration.  I
figured that I wanted some kind of map structure, but didn’t want to have to
declare an explicit type for the value.

[Turns out][link-11] that a way to do this is to specify the type as an empty
interface, which every data type will match:

<pre class="brush:go">
data := map[string] interface{} {
  "Content":  r.FormValue("content"),
  "Seconds": time.Seconds(),
  "Host": r.Host,
}
</pre>

That worked fine as well, and allows me to be a bit more flexible in what I
pass to the template renderer.

To sum up, this was a pretty trivial example, but a nice way to get used to
some of the different semantics and conventions in Go.  I was encouraged to
find that every issue I encountered had a straightforward (and easily
discoverable) solution.  I hope to be using Go for some more sophisticated
projects in the future, and expect to be writing more here as I learn.  Once
again, you can find the complete project [on GitHub][link-3].

<span id="note">(* Not that you can’t refactor Python, but in practice it’s
pretty awful unless you have tons of decent unit tests.)</span>
