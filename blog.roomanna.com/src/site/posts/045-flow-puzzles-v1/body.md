[goals]: {{link "043-2017"}}
[rete]: https://github.com/retejs/rete
[shenzen]: http://www.zachtronics.com/shenzhen-io/

I've had a game idea bouncing around in the back of my head for a few years now.  In fact, many of [my goals][goals] in the past few years: watching more art films, learning to paint, and publishing a small game have been in service of expanding my repertoire to be able to work on this larger meta project.

The game itself is structured as a puzzle-based adventure game, where solving puzzle challenges in effect unlock skills which can be used to advance the story.  The puzzles themselves are supposed to be abstractions of programming challenges, but presented in a way so that non-programmers could complete them.  I wanted to explore the space of manipulating a stream of data, rather than some kind of Turing complete programming environment like [Shenzen I/O][shenzen] (which does that really, really well).

A short time ago, a member of my team at work showed me [Rete.js][rete], a framework for building node/graph editors in Javascript.  This felt intuitively like how I wanted to construct puzzles, so in the spirit of some rapid prototyping, here are a couple demos working out the characteristics of this space.

<!--BREAK-->

<div id="puzzle01" class="puzzle">
  <h2>Mechanics</h2>
  <p>As an example of what I was thinking about, I wanted to challenge players to construct a data flow system which would be given a set of "test runs" of data.  Each run would have an expected output, and all tests would have to pass in order to advance the story.</p>
  <p>The mechanics of building the system would be to connect the input data stream to the output data stream, passing through one or more nodes in order to construct the appropriate output. My expectation is that most of the puzzles will be hard in terms of constructing the right output, but that the best puzzles will be ones which encourage players to jump to conclusions and reach incorrect solutions which work for a majority of cases but not all of them.</p>
  <div class="node-editor" tabindex="1"></div>
  <h3>Controls</h3>
  <div class="buttons">
    <table class="table table-bordered">
      <tbody>
        <tr>
          <th scope="row">Add nodes</th>
          <td>
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
  <h3>Results</h3>
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

<div id="puzzle02" class="puzzle">
  <h2>Puzzle 02</h2>
  <div class="node-editor" tabindex="1"></div>
  <h3>Controls</h3>
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
  <h3>Results</h3>
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
