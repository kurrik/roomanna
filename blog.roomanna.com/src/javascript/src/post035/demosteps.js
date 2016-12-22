import SlidingWindow from './slidingwindow';
import { drawTable } from './common';

const win = new SlidingWindow(5, SlidingWindow.Min);
const domRoot = document.getElementById('demosteps');
const domAddButton = domRoot.querySelector('button.addstep');
const domAddInput = domRoot.querySelector('input.addstep');

let audit = [];
const limit = 20;

function add(val) {
  for (let step of win.step(val, true)) {
    audit.push(step);
  }
  if (audit.length > limit) {
    audit.splice(0, audit.length - limit);
  }
  return audit;
}

function onInput() {
  domAddButton.textContent = `Add ${domAddInput.value}`;
}

function onClick() {
  add(parseInt(domAddInput.value));
  domAddInput.value = Math.round(Math.random() * 20);
  onInput();
  drawTable(audit, domRoot);
}

add(10);
add(5);
add(8);
domAddInput.addEventListener('input', onInput);
domAddButton.addEventListener('click', onClick);
onInput();
drawTable(audit, domRoot);
