import 'babel-polyfill';

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
    domCell.classList.remove('table-danger');
    domCell.classList.remove('table-success');
    if (output != '') {
      if (output != test.expected) {
        domCell.classList.add('table-danger');
      } else {
        domCell.classList.add('table-success');
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
    { input: 'MOON', expected: 'PQQQ' },

  ],
  {"id":"puzzle01@0.1.0","nodes":{"1":{"id":1,"data":{"sequence":["M","O","O","N"]},"inputs":[],"outputs":[{"connections":[{"node":5,"input":0,"data":{}}]}],"position":[20,200],"name":"Input"},"3":{"id":3,"data":{"output":"PQQQ"},"inputs":[{"connections":[{"node":6,"output":0,"data":{}}]}],"outputs":[],"position":[800,200],"name":"Output"},"5":{"id":5,"data":{"amount":12},"inputs":[{"connections":[{"node":1,"output":0,"data":{}}]},{"connections":[]}],"outputs":[{"connections":[{"node":6,"input":0,"data":{}}]}],"position":[273.09925639053506,131.39107509024126],"name":"Increment"},"6":{"id":6,"data":{"amount":-9},"inputs":[{"connections":[{"node":5,"output":0,"data":{}}]},{"connections":[]}],"outputs":[{"connections":[{"node":3,"input":0,"data":{}}]}],"position":[526.0434593297845,245.6502693958644],"name":"Increment"}}},
  {
    input: new cmp.InputComponent(),
    output: new cmp.OutputComponent(),
    increment: new cmp.IncrementComponent(),
  }
);

renderPuzzle(
  '#puzzle02',
  [
    { input: 'ABC', expected: 'DEF' },
    { input: 'MOON', expected: 'NPR' },
    { input: 'AABCC', expected: 'CCD' },
  ],
  {"id":"puzzle02@0.1.0","nodes":{"2":{"id":2,"data":{"sequence":["A","A","B","C","C"]},"inputs":[],"outputs":[{"connections":[{"node":10,"input":0,"data":{}},{"node":11,"input":0,"data":{}}]}],"position":[20,200],"name":"Input"},"4":{"id":4,"data":{"output":"CCD"},"inputs":[{"connections":[{"node":13,"output":0,"data":{}}]}],"outputs":[],"position":[800,200],"name":"Output"},"10":{"id":10,"data":{},"inputs":[{"connections":[{"node":2,"output":0,"data":{}}]},{"connections":[{"node":11,"output":0,"data":{}}]}],"outputs":[{"connections":[{"node":12,"input":0,"data":{}}]}],"position":[569.424603300456,63.495055300427794],"name":"Join"},"11":{"id":11,"data":{"amount":3},"inputs":[{"connections":[{"node":2,"output":0,"data":{}}]},{"connections":[]}],"outputs":[{"connections":[{"node":10,"input":1,"data":{}}]}],"position":[272.9676054490978,5.3320155667772635],"name":"Increment"},"12":{"id":12,"data":{"position":3},"inputs":[{"connections":[{"node":10,"output":0,"data":{}}]},{"connections":[]}],"outputs":[{"connections":[]},{"connections":[{"node":13,"input":0,"data":{}}]}],"position":[260.9049586977488,305.51757395210893],"name":"Split"},"13":{"id":13,"data":{"position":3},"inputs":[{"connections":[{"node":12,"output":1,"data":{}}]},{"connections":[]}],"outputs":[{"connections":[{"node":4,"input":0,"data":{}}]},{"connections":[]}],"position":[560.6935220301846,299.2567205965452],"name":"Split"}}},
  {
    input: new cmp.InputComponent(),
    output: new cmp.OutputComponent(),
    join: new cmp.JoinComponent(),
    increment: new cmp.IncrementComponent(),
    split: new cmp.SplitComponent(),
  }
);
