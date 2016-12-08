import SlidingWindow from './slidingwindow';
import { drawTable } from './common';

const win = new SlidingWindow(5, SlidingWindow.Min);
const domRoot = document.getElementById('demosteps');
const domRandom = domRoot.querySelector('.addrandom');

let audit = [];

function add(val) {
  for (let step of win.step(val)) {
    audit.push({ label: step, data: win.toArray() });
  }
  return audit;
}

add(10);
add(5);
add(8);
domRandom.addEventListener('click', (evt) => {
  add(Math.round(Math.random() * 10));
  drawTable(audit, domRoot);
});
drawTable(audit, domRoot);
