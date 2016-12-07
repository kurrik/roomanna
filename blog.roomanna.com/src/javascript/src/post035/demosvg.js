import PointWindow from './pointwindow';
import * as d3 from 'd3';
import styles from './demosvg.css';

const windowSize = 5;
const maxPoints = 50;
const halfPt = 6;
const lineWidth = 2;

const svgDom = document.getElementById('svg');
const pointsDom = document.getElementById('points');
const windowsDom = document.getElementById('windows');

const allDom = [ svgDom, pointsDom, windowsDom ];

let index = 0;
let points = [];
let win = new PointWindow(windowSize);

function drawSvg() {
  const rects = d3
    .select('#svgPoints')
    .selectAll(`rect.${styles.point}`)
    .data(points);

  rects
    .enter()
      .append('rect')
      .classed(styles.point, true)
      .attr('width', halfPt * 2)
      .attr('height', halfPt * 2)
    .merge(rects)
      .attr('x', (p) => p[0] - halfPt)
      .attr('y', (p) => p[1] - halfPt)
      .attr('data-index', (p) => p[2])
      .classed(styles.active, (p, i) => i < windowSize);

  rects.exit().remove();

  const borderData = [{
    x: win.minX,
    y: win.minY,
    w: win.maxX - win.minX,
    h: win.maxY - win.minY
  }];

  const border = d3
    .select('#svgBorder')
    .selectAll(`rect.${styles.border}`)
    .data(borderData);

  border
    .enter()
      .append('rect')
      .classed(styles.border, true)
    .merge(border)
      .attr('x', (p) => p.x)
      .attr('y', (p) => p.y)
      .attr('width', (p) => p.w)
      .attr('height', (p) => p.h);

  border.exit().remove();
}

function drawPoints() {
  const elems = d3
    .select('#points')
    .selectAll(`span.${styles.point}`)
    .data(points);

  elems
    .enter()
      .append('span')
    .merge(elems)
      .classed(styles.point, true)
      .classed(styles.active, (p, i) => i < windowSize)
      .attr('data-index', (p) => p[2])
      .html((p) => `(${p[0]},${p[1]})`);

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
    .selectAll(`div.${styles.entry}`)
    .data((p) => p.data);

  cells
    .enter()
      .append('div')
    .merge(cells)
      .classed(styles.entry, true)
      .classed(styles.active, (p, i) => i == 0)
      .attr('data-index', (p) => p.index)
      .html((p) => `<span class='${styles.index}'>${p.index}:</span> <span class='${styles.value}'>${p.value}</span>`);

  cells.exit().remove();
}

function draw() {
  drawSvg();
  drawPoints();
  drawWindows();
}

function addPoint(evt) {
  points.splice(0, 0, [evt.offsetX, evt.offsetY, index]);
  win.add(evt.offsetX, evt.offsetY);
  while (points.length > maxPoints) {
    points.pop();
  }
  index++;
  draw();
}

function addHover(idx) {
  allDom.forEach((e) => {
    e.querySelectorAll(`[data-index="${idx}"]`)
      .forEach((x) => x.classList.add(styles.hover));
  });
}

function clearHover() {
  allDom.forEach((e) => {
    e.querySelectorAll(`[data-index].${styles.hover}`)
      .forEach((x) => x.classList.remove(styles.hover));
  });
}

function checkDisable(evt) {
  const idx = getIdx(evt.target);
  if (idx) {
    evt.stopPropagation();
    clearHover();
  }
}

function checkEnable(evt) {
  const idx = getIdx(evt.target);
  if (idx) {
    evt.stopPropagation();
    clearHover();
    addHover(idx);
  }
}

function getIdx(node) {
  let idx;
  while (node && node != document) {
    idx = node.getAttribute('data-index');
    if (idx) {
      return idx;
    }
    node = node.parentNode;
  }
  return null;
}

document.addEventListener('mouseover', checkEnable);
document.addEventListener('mouseout', checkDisable);
document.addEventListener('click', checkEnable);
svgDom.addEventListener('click', addPoint);
