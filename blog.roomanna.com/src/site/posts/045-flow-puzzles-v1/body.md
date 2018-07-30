[goals]: {{link "043-2017"}}
[rete]: https://github.com/retejs/rete
[shenzen]: http://www.zachtronics.com/shenzhen-io/

I've had a game idea bouncing around in the back of my head for a few years
now.  In fact, many of [my goals][goals] in the past few years (i.e. watching more
art films, learning to paint, and publishing a small game) have been in service
of expanding my repertoire to be able to work on this larger meta project.

The game itself is structured as a puzzle-based adventure game, where solving
puzzle challenges in effect unlock skills which can be used to advance the
story.  The puzzles themselves are supposed to be abstractions of programming
challenges, but presented in a way so that non-programmers could complete them.
I wanted to explore the space of manipulating a stream of data, rather than
some kind of Turing complete programming environment like [Shenzen
I/O][shenzen] (which does that really, really well).

A short time ago, a member of my team at work showed me [Rete.js][rete], a
framework for building node/graph editors in Javascript.  This felt intuitively
like how I wanted to construct puzzles, so in the spirit of some rapid
prototyping, here are a couple demos working out the characteristics of this
space.

<!--BREAK-->

<div id="puzzle01" class="puzzle">
  <h2>Mechanics</h2>
  <p>As an example of what I was thinking about, I wanted to challenge players
to construct a data flow system which would be given a set of "test runs" of
data.  Each run would have an expected output, and all tests would have to pass
in order to advance the story.</p> <p>The mechanics of building the system
would be to connect the input data stream to the output data stream, passing
through one or more nodes in order to construct the appropriate output. My
expectation is that most of the puzzles will be hard in terms of constructing
the right output, but that the best puzzles will be ones which encourage
players to jump to conclusions and reach incorrect solutions which work for a
majority of cases but not all of them.</p> <p>Here's an example puzzle along
these lines.  The goal is to connect the input and output nodes in a way which
will cause the desired output to be generated.</p>
  <div class="node-editor" tabindex="1"></div>
  <p>Use the buttons below to add <code>Increment</code> nodes to the graph
which can be used to solve the puzzle.  If you just want to see the solution,
press <code>Show solution</code> below.</p>
  <div class="buttons">
    <table class="table table-bordered">
      <tbody>
        <tr>
          <th scope="row">Add nodes</th>
          <td>
            <button class="btn btn-success add" data-component="increment" data-toggle="tooltip" data-placement="top" title="Increase the value of every item in the stream by the specified amount">Increment</button>
          </td>
        </tr>
        <tr>
          <th scope="row">Operations</th>
          <td>
            <button class="btn btn-warning solve">Show solution</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>Each of the test inputs, expected outputs, and what the configured graph
actually outputs for the test are displayed in the chart below.  You have
solved the puzzle when all of the outputs match the expected outputs.</p>
  <table class="results table table-bordered">
    <tbody>
      <tr class="input-row">
        <th scope="row">Input</th>
      </tr>
      <tr class="expected-row">
        <th scope="row">Expected</th>
      </tr>
      <tr class="output-row">
        <th scope="row">Output</th>
      </tr>
    </tbody>
  </table>
  <p>This puzzle requires a little bit of experimentation - it turns out that
the increment node does not roll over from 'Z' -&gt; 'A', and that negative values
are supportive.  Understanding these principles are the key to solving the
third case.</p>
</div>

<div id="puzzle02" class="puzzle">
  <h2>Split / Join</h2>
  <div class="node-editor" tabindex="1"></div>
  <p>This puzzle introduces the idea of splitting and joining streams.</p>
  <div class="buttons">
    <table class="table table-bordered">
      <tbody>
        <tr>
          <th scope="row">Add nodes</th>
          <td>
            <button class="btn btn-success add" data-component="split">Split</button>
            <button class="btn btn-success add" data-component="join">Join</button>
            <button class="btn btn-success add" data-component="increment">Increment</button>
          </td>
        </tr>
        <tr>
          <th scope="row">Operations</th>
          <td>
            <button class="btn btn-warning solve">Show solution</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>A solution here is far more special cased, and requires understanding how
the split and join nodes handle different offsets for streams of different
sizes.  Keep in mind that you don't need to connect all outputs!</p>
  <table class="results table table-bordered">
    <tbody>
      <tr class="input-row">
        <th scope="row">Input</th>
      </tr>
      <tr class="expected-row">
        <th scope="row">Expected</th>
      </tr>
      <tr class="output-row">
        <th scope="row">Output</th>
      </tr>
    </tbody>
  </table>
</div>

It feels like there's some merit here.  I'm looking forward to trying a few
different iterations along this theme to see where I wind up!
