import 'babel-polyfill';

import styles from './main.css';

import Alight from 'alight';
import Rete from 'rete';
import * as ConnectionPlugin from 'rete-connection-plugin';
import * as AlightRenderPlugin from 'rete-alight-render-plugin';
import * as ContextMenuPlugin from 'rete-context-menu-plugin';
import * as AreaPlugin from 'rete-area-plugin';

const sequenceSocket = new Rete.Socket('Sequence');

class IncrementComponent extends Rete.Component {
  constructor(){
    super('Increment');
  }

  builder(node) {
    const inp = new Rete.Input('Input', sequenceSocket);
    const out = new Rete.Output('Output', sequenceSocket);
    return node
      .addInput(inp)
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const values = inputs[0][0] || [];
    outputs[0] = values.map(x => String.fromCharCode(x.charCodeAt(0) + 1));
  }
}

class DataControl extends Rete.Control {
  constructor(emitter, key) {
    super();
    this.emitter = emitter;
    this.key = key;
    this.template = '<div>{{value}}</div>';

    this.scope = {
      value: '',
    };
  }

  mounted() {
    this.setValue(this.getData(this.key));
  }

  setValue(val) {
    this.scope.value = (val || []).join(',');
    this._alight.scan()
    //this.putData(this.key, val);
    //this.emitter.trigger('process');
  }
}

class InputComponent extends Rete.Component {
  constructor() {
    super('Input');
  }

  builder(node) {
    return node
      .addControl(new DataControl(this.editor, 'sequence'))
      .addOutput(new Rete.Output('Output', sequenceSocket));
  }

  worker(node, inputs, outputs, arg1) {
    const values = node.data.sequence || [];
    outputs[0] = values;
  }
}

class OutputComponent extends Rete.Component {
  constructor() {
    super('Output');
  }

  builder(node) {
    return node
      .addControl(new DataControl(this.editor, 'sequence'))
      .addInput(new Rete.Input('Input', sequenceSocket));
  }

  worker(node, inputs) {
    const values = inputs[0][0] || ['<EMPTY>'];
    const output = values.join('');
    node.data.output = output;
    this.editor.nodes.find(n => n.id == node.id).controls[0].setValue(values);
  }
}

async function renderPuzzle(selector, input, expected, components) {
  const domBase = document.querySelector(selector);
  const domEditor = domBase.querySelector('.node-editor');
  const domInput = domBase.querySelector('.input');
  const domOutput = domBase.querySelector('.output');
  const domOutputRow = domBase.querySelector('.output-row');
  const domExpected = domBase.querySelector('.expected');
  const domButtonRun = domBase.querySelector('.run');

  const engine = new Rete.Engine('puzzle@0.1.0');
  const editor = new Rete.NodeEditor('puzzle@0.1.0', domEditor);
  editor.use(ConnectionPlugin, { curvature: 0.4 });
  editor.use(AlightRenderPlugin);
  editor.use(ContextMenuPlugin);
  editor.use(AreaPlugin);

  Object.values(components).map(c => {
    editor.register(c);
    engine.register(c);
  });

  const inputNode = await components.input.createNode({sequence: input.split('')});
  const outputNode = await components.output.createNode();

  inputNode.position = [20, 200];
  outputNode.position = [600, 200];

  editor.addNode(inputNode);
  editor.addNode(outputNode);

  editor.on('process connectioncreate connectionremove nodecreate noderemove', async ()=>{
    if(editor.silent) return;
    requestAnimationFrame(async () => {
      await engine.abort();
      await engine.process(editor.toJSON(), inputNode.id);
      const output = outputNode.data.output;
      domOutput.innerText = output;
      if (output != '') {
        if (output != expected) {
          domOutputRow.setAttribute('class', 'table-danger');
        } else {
          domOutputRow.setAttribute('class', 'table-success');
        }
      }

    });
  });

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger('process');
  domInput.innerText = input;
  domExpected.innerText = expected;
  domButtonRun.addEventListener('click', async ()=>{
    console.log('click');
  });
}

const components = {
  input: new InputComponent(),
  output: new OutputComponent(),
  increment: new IncrementComponent(),
};

renderPuzzle(
  '#puzzle01',
  'AAA',
  'BBB',
  components
);
