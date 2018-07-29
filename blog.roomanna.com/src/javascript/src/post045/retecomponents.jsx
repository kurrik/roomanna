import Rete from 'rete';

import {NumControl, DataControl} from './retecontrols';

const sequenceSocket = new Rete.Socket('Sequence');
const numberSocket = new Rete.Socket('Number');

export class IncrementComponent extends Rete.Component {
  constructor(){
    super('Increment');
  }

  builder(node) {
    const inp = new Rete.Input('Input', sequenceSocket);
    const out = new Rete.Output('Output', sequenceSocket);
    const amt = new Rete.Input('Amount', numberSocket);
    amt.addControl(new NumControl(this.editor, 'amount'));
    node.data.amount = node.data.amount || 1;
    return node
      .addInput(inp)
      .addInput(amt)
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const values = inputs[0][0] || [];
    const amount = node.data.amount || 0;
    outputs[0] = values.map(x => String.fromCharCode(x.charCodeAt(0) + amount));
  }
}

export class HeadComponent extends Rete.Component {
  constructor(){
    super('Head');
  }

  builder(node) {
    const inp = new Rete.Input('Input', sequenceSocket);
    const outHead = new Rete.Output('Head', sequenceSocket);
    const outTail = new Rete.Output('Tail', sequenceSocket);
    return node
      .addInput(inp)
      .addOutput(outHead)
      .addOutput(outTail);
  }

  worker(node, inputs, outputs) {
    const values = inputs[0][0] || [];
    outputs[0] = values.slice(0, 1);
    outputs[1] = values.slice(1);
  }
}

export class SplitComponent extends Rete.Component {
  constructor(){
    super('Split');
  }

  builder(node) {
    const input = new Rete.Input('Input', sequenceSocket);
    const outHead = new Rete.Output('Head', sequenceSocket);
    const outTail = new Rete.Output('Tail', sequenceSocket);
    const position = new Rete.Input('Position', numberSocket);
    position.addControl(new NumControl(this.editor, 'position'));
    node.data.position = node.data.position || 1;
    return node
      .addInput(input)
      .addInput(position)
      .addOutput(outHead)
      .addOutput(outTail);
  }

  worker(node, inputs, outputs) {
    const values = inputs[0][0] || [];
    const position = node.data.position || 0;
    outputs[0] = values.slice(0, position);
    outputs[1] = values.slice(position);
  }
}

export class JoinComponent extends Rete.Component {
  constructor(){
    super('Join');
  }

  builder(node) {
    const inpHead = new Rete.Input('Head', sequenceSocket);
    const inpTail = new Rete.Input('Tail', sequenceSocket);
    const out= new Rete.Output('Output', sequenceSocket);
    return node
      .addInput(inpHead)
      .addInput(inpTail)
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const head = inputs[0][0] || [];
    const tail = inputs[1][0] || [];
    outputs[0] = head.concat(tail);
  }
}

export class InputComponent extends Rete.Component {
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

export class OutputComponent extends Rete.Component {
  constructor() {
    super('Output');
  }

  builder(node) {
    return node
      .addControl(new DataControl(this.editor, 'sequence'))
      .addInput(new Rete.Input('Input', sequenceSocket));
  }

  worker(node, inputs) {
    const values = inputs[0][0] || [];
    const output = values.join('');
    node.data.output = output;
    this.editor.nodes
      .find(n => n.name == "Output")
      .controls[0]
      .setValue(values);
  }
}
