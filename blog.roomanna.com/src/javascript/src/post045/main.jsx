import 'babel-polyfill';
import $ from 'jquery';

import styles from './main.css';

import Rete from 'rete';
import * as cmp from './retecomponents';
import * as AlightRenderPlugin from 'rete-alight-render-plugin';
import * as AreaPlugin from 'rete-area-plugin';
import * as ConnectionPlugin from 'rete-connection-plugin';

async function renderPuzzle(selector, tests, solution, components) {
  const domBase = document.querySelector(selector);
  const domEditor = domBase.querySelector('.node-editor');
  const domInput = domBase.querySelector('.input');
  const domInputRow = domBase.querySelector('.input-row');
  const domOutput = domBase.querySelector('.output');
  const domOutputRow = domBase.querySelector('.output-row');
  const domExpected = domBase.querySelector('.expected');
  const domExpectedRow = domBase.querySelector('.expected-row');
  const domButtonRun = domBase.querySelector('.run');

  // Ignore scrolling on the editor, and scroll the page naturally.
  domEditor.addEventListener('wheel', (e) => {
    e.stopImmediatePropagation();
    return true;
  }, true);

  const name = selector.replace('#', '') + '@0.1.0';
  const engine = new Rete.Engine(name);
  const editor = new Rete.NodeEditor(name, domEditor);
  editor.use(ConnectionPlugin, { curvature: 0.4 });
  editor.use(AlightRenderPlugin);
  editor.use(AreaPlugin);

  Object.values(components).map(c => {
    editor.register(c);
    engine.register(c);
  });

  var inputNode = await components.input.createNode();
  var outputNode = await components.output.createNode();

  inputNode.position = [20, 200];
  outputNode.position = [800, 200];

  editor.addNode(inputNode);
  editor.addNode(outputNode);

  const domCells = tests.map(t => {
    const cellInput = document.createElement('td');
    domInputRow.appendChild(cellInput);
    cellInput.innerText = t.input;
    const cellOutput = document.createElement('td');
    domOutputRow.appendChild(cellOutput);
    const cellExpected = document.createElement('td');
    domExpectedRow.appendChild(cellExpected);
    cellExpected.innerText = t.expected;
    return {
      input: cellInput,
      output: cellOutput,
      expected: cellExpected,
    };
  });

  async function process(test, index) {
    inputNode.data.sequence = test.input.split('');
    inputNode.controls[0].mounted();
    await engine.abort();
    await engine.process(editor.toJSON(), inputNode.id);
    const output = outputNode.data.output;
    const domCell = domCells[index].output;
    domCell.innerText = output;
    domCell.classList.remove('danger');
    domCell.classList.remove('success');
    if (output != '') {
      if (output != test.expected) {
        domCell.classList.add('danger');
      } else {
        domCell.classList.add('success');
      }
    }
  }

  // Related to processing, checking state of game.
  editor.on('process connectioncreate connectionremove nodecreate noderemove', async () => {
    requestAnimationFrame(async () => {
      for (var i = 0; i < tests.length; i++) {
        await(process(tests[i], i));
      }
    });
  });

  // Generally disabled actions which don't need to check nodes.
  editor.on('translate zoom', () => {
    return false;
  });

  // Prevent actions on input / output nodes.
  function isRestricted(node) {
    return node.id == inputNode.id || node.id == outputNode.id;
  }
  editor.on('nodetranslate', ({ node, x, y }) => {
    if (editor.allowAllOperations) return true;
    return !isRestricted(node);
  });
  editor.on('noderemove nodeselect', (node) => {
    if (editor.allowAllOperations) return true;
    return !isRestricted(node);
  });

  //editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger('process');

  domBase.addEventListener('click', async (e) => {
    const classList = e.target.classList;
    if (classList.contains('add')) {
      const component = e.target.getAttribute('data-component');
      if (component && components.hasOwnProperty(component)) {
        const node = await components[component].createNode();
        const randomX = Math.random() * 50 - 25;
        const randomY = Math.random() * 50 - 25;
        node.position = [410 + randomX, 200 + randomY];
        editor.addNode(node);
      }
    } else if (classList.contains('solve')) {
      editor.allowAllOperations = true;
      editor.clear();
      editor.allowAllOperations = false;
      await editor.fromJSON(solution);
      inputNode = editor.nodes.find(n => n.name == "Input");
      outputNode = editor.nodes.find(n => n.name == "Output");
      await editor.trigger('process');
    }
  });

  domBase.addEventListener('keydown', async (e) => {
    if (e.keyCode == 8 || e.keyCode == 46) {
      if (e.target.nodeName.toUpperCase() == 'INPUT') {
        return;
      }
      editor.selected.list.forEach(n => {
        if (!isRestricted(n)) {
          editor.removeNode(n);
        }
      });
    } else if (e.keyCode == 192) {
      console.log(JSON.stringify(editor.toJSON()));
    }
  });
}

renderPuzzle(
  '#puzzle01',
  [
    { input: 'AAA', expected: 'DDD' },
    { input: 'CDEF', expected: 'FGHI' },
  ],
  {"id":"puzzle01@0.1.0","nodes":{"1":{"id":1,"data":{"sequence":["C","D","E","F"]},"inputs":[],"outputs":[{"connections":[{"node":5,"input":0,"data":{}}]}],"position":[20,200],"name":"Input"},"3":{"id":3,"data":{"output":"FGHI"},"inputs":[{"connections":[{"node":5,"output":0,"data":{}}]}],"outputs":[],"position":[800,200],"name":"Output"},"5":{"id":5,"data":{"amount":3},"inputs":[{"connections":[{"node":1,"output":0,"data":{}}]},{"connections":[]}],"outputs":[{"connections":[{"node":3,"input":0,"data":{}}]}],"position":[406.4390554143261,201.10721542109553],"name":"Increment"}}},
  {
    input: new cmp.InputComponent(),
    output: new cmp.OutputComponent(),
    increment: new cmp.IncrementComponent(),
  }
);

renderPuzzle(
  '#puzzle02',
  [
    { input: 'ABC', expected: 'ADC' },
    { input: 'AABCC', expected: 'ACBCC' },
  ],
  {"id":"puzzle02@0.1.0","nodes":{"2":{"id":2,"data":{"sequence":["A","A","B","C","C"]},"inputs":[],"outputs":[{"connections":[{"node":5,"input":0,"data":{}}]}],"position":[20,200],"name":"Input"},"4":{"id":4,"data":{"output":"ACBCC"},"inputs":[{"connections":[{"node":6,"output":0,"data":{}}]}],"outputs":[],"position":[800,200],"name":"Output"},"5":{"id":5,"data":{"position":1},"inputs":[{"connections":[{"node":2,"output":0,"data":{}}]},{"connections":[]}],"outputs":[{"connections":[{"node":6,"input":0,"data":{}}]},{"connections":[{"node":7,"input":0,"data":{}}]}],"position":[256.6515112080528,20.169369983629878],"name":"Split"},"6":{"id":6,"data":{},"inputs":[{"connections":[{"node":5,"output":0,"data":{}}]},{"connections":[{"node":9,"output":0,"data":{}}]}],"outputs":[{"connections":[{"node":4,"input":0,"data":{}}]}],"position":[558.2519222760008,38.24653558968016],"name":"Join"},"7":{"id":7,"data":{"position":1},"inputs":[{"connections":[{"node":5,"output":1,"data":{}}]},{"connections":[]}],"outputs":[{"connections":[{"node":8,"input":0,"data":{}}]},{"connections":[{"node":9,"input":1,"data":{}}]}],"position":[156.28953442173764,343.73944101797093],"name":"Split"},"8":{"id":8,"data":{"amount":2},"inputs":[{"connections":[{"node":7,"output":0,"data":{}}]},{"connections":[]}],"outputs":[{"connections":[{"node":9,"input":0,"data":{}}]}],"position":[385.340751249672,258.7618759038483],"name":"Increment"},"9":{"id":9,"data":{},"inputs":[{"connections":[{"node":8,"output":0,"data":{}}]},{"connections":[{"node":7,"output":1,"data":{}}]}],"outputs":[{"connections":[{"node":6,"input":1,"data":{}}]}],"position":[611.159127021008,370.4306957686656],"name":"Join"}}},
  {
    input: new cmp.InputComponent(),
    output: new cmp.OutputComponent(),
    join: new cmp.JoinComponent(),
    increment: new cmp.IncrementComponent(),
    split: new cmp.SplitComponent(),
  }
);
