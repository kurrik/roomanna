// Copyright 2017 Arne Roomann-Kurrik
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import './fonts.css';
import './base.css';

import TextMapper from './textmapper';
import CanvasManager from './canvasmanager';

function Point(x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.color = color;
};

var stepInterval = null;
var manager = null;
var x = null;
var y = null;

function step() {
  if (manager.step() == false) {
    window.clearInterval(stepInterval);
    stepInterval = null;
  }
  manager.draw();
};

function startStepping() {
  if (!stepInterval) {
    stepInterval = window.setInterval(step, 40);
  }
};

function onMouseMove(evt) {
  if (x == null || y == null) {
    x = evt.pageX;
    y = evt.pageY;
  } else {
    const deltaX = Math.abs(evt.pageX - x);
    const deltaY = Math.abs(evt.pageY - y);
    if (deltaX > 5 || deltaY > 5) {
      window.removeEventListener('mousemove', onMouseMove, false);
      startStepping();
    }
  }
};

function onClick(evt) {
  console.log(evt);
  manager.onClick(evt.offsetX, evt.offsetY);
  startStepping();
};

function onSelectStart(evt) {
  evt.preventDefault();
  return false;
};

window.addEventListener('load', function() {
  window.setTimeout(function() {
    var text = new TextMapper(80, 20);
    text.drawText('roomanna.com');
    manager = new CanvasManager(800, 200);
    document.getElementById('canvas').appendChild(manager.canvas);
    manager.canvas.addEventListener('click', onClick, false);
    manager.canvas.addEventListener('selectstart', onSelectStart, false);
    manager.addPoints(text.canvas);
    manager.draw();
    window.addEventListener('mousemove', onMouseMove, false);
  }, 100);
}, false);

