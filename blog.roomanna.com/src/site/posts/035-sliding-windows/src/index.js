import PointWindow from './pointwindow';

const windowSize = 5;
const maxPoints = 50;
const halfPt = 6;

const canvas = document.getElementById('canvas');
const w = parseInt(canvas.getAttribute('width'));
const h = parseInt(canvas.getAttribute('height'));
const ctx = canvas.getContext('2d');

let points = [];
let win = new PointWindow(windowSize);

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (var i = 0; i < points.length; i++) {
    ctx.fillStyle = (i < windowSize) ? 'rgb(0,200,0)' : 'rgb(200,0,0)';
    ctx.fillRect(points[i][0] - halfPt, points[i][1] - halfPt, halfPt * 2, halfPt * 2);
  }
  var winW = win.maxX - win.minX;
  var winH = win.maxY - win.minY;
  ctx.strokeStyle = 'rgb(0,0,200)';
  ctx.strokeRect(win.minX, win.minY, winW, winH);
}

canvas.addEventListener('click', function(evt) {
  points.splice(0, 0, [evt.offsetX, evt.offsetY]);
  win.add(evt.offsetX, evt.offsetY);
  while (points.length > maxPoints) {
    points.pop();
  }
  draw();
});

export { PointWindow };
