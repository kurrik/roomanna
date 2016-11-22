import PointWindow from './pointwindow';
import * as d3 from 'd3';

const windowSize = 5;
const maxPoints = 50;
const halfPt = 6;
const lineWidth = 2;

const canvasDom = document.getElementById('canvas');
const pointsDom = document.getElementById('points');
const minxDom = document.getElementById('minx');
const minyDom = document.getElementById('miny');
const maxxDom = document.getElementById('maxx');
const maxyDom = document.getElementById('maxy');
const w = parseInt(canvasDom.getAttribute('width'));
const h = parseInt(canvasDom.getAttribute('height'));
const ctx = canvasDom.getContext('2d');

const COLOR_ACTIVE = '#FFB30F';
const COLOR_EXTRA = '#437F97';
const COLOR_BORDER = '#FC020A';

let points = [];
let win = new PointWindow(windowSize);

function drawCanvas() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, w, h);
  for (var i = 0; i < points.length; i++) {
    ctx.fillStyle = (i < windowSize) ? COLOR_ACTIVE : COLOR_EXTRA;
    ctx.fillRect(points[i][0] - halfPt, points[i][1] - halfPt, halfPt * 2, halfPt * 2);
  }
  var winW = win.maxX - win.minX;
  var winH = win.maxY - win.minY;
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(win.minX, win.minY, winW, winH);
}

function drawPoints() {
  const elems = d3
    .select('#points')
    .selectAll('span.point')
    .data(points);

  elems
    .enter()
      .append('span')
    .merge(elems)
      .classed('point', true)
      .style('color', (x, i) => i < windowSize ? COLOR_ACTIVE : COLOR_EXTRA)
      .text((x) => `(${x[0]},${x[1]})`);

  elems.exit().remove();
}

function drawWindows() {
  const rows = d3
    .select('#windows')
    .select('tbody')
    .selectAll('tr')
    .data(win.data());

  const newrow = rows
    .enter()
      .append('tr');

  newrow
    .append('th')
    .text((x) => x.label);

  newrow
    .append('td');

  rows.exit().remove();

  const cells = d3
    .select('#windows')
    .select('tbody')
    .selectAll('tr')
    .select('td')
    .selectAll('span')
    .data((x) => x.data);

  cells
    .enter()
      .append('span')
    .merge(cells)
      .classed('point', true)
      .style('color', (x, i) => i == 0 ? COLOR_BORDER : COLOR_EXTRA)
      .text((x) => `(${x.value},${x.index})`);

  cells
    .exit()
    .remove();
}

function draw() {
  drawCanvas();
  drawPoints();
  drawWindows();
}

canvasDom.addEventListener('click', function(evt) {
  points.splice(0, 0, [evt.offsetX, evt.offsetY]);
  win.add(evt.offsetX, evt.offsetY);
  while (points.length > maxPoints) {
    points.pop();
  }
  draw();
});

export { PointWindow };
