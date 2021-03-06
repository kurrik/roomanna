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

export default function CanvasManager(w, h) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = w;
  this.canvas.height = h;
  this.context = this.canvas.getContext('2d');
  this.points = [];
};

CanvasManager.prototype.addPoints = function(canvas) {
  this.pointsx = canvas.width;
  this.pointsy = canvas.height;
  this.pointw = Math.round(this.canvas.width / canvas.width);
  this.pointh = Math.round(this.canvas.height / canvas.height);
  var context = canvas.getContext('2d');
  var id = context.getImageData(0, 0, canvas.width, canvas.height);
  for (var y = 0; y < canvas.height; y++) {
    for (var x = 0; x < canvas.width; x++) {
      var index = 4 * (y * canvas.width + x);
      var r = id.data[index];
      var g = id.data[index + 1];
      var b = id.data[index + 2];
      var a = id.data[index + 3];
      if (r < 100 && g < 100 && b < 100 && a > 150) {
        this.addPoint(x, y);
      }
    }
  }
};

CanvasManager.prototype.getPoint = function(x, y) {
  var index = (y * this.pointsx) + x;
  if (index >= 0 && index < this.points.length) {
    return this.points[index];
  } else {
    return null;
  }
};

CanvasManager.prototype.clearPoint = function(x, y) {
  var index = (y * this.pointsx) + x;
  if (index >= 0 && index < this.points.length) {
    delete this.points[index];
  }
};

CanvasManager.prototype.addPoint = function(x, y, color) {
  if (x >= 0 && x < this.pointsx && y >= 0 && y < this.pointsy) {
    if (color == null) {
      color = parseInt('666666', 16);
    }
    var index = (y * this.pointsx) + x;
    this.points[index] = color;
  }
};

CanvasManager.prototype.onClick = function(x, y) {
  var sx = Math.floor(x / this.pointw);
  var sy = Math.floor(y / this.pointh);
  var point = this.getPoint(sx, sy);
  if (point) {
    this.clearPoint(sx, sy);
  } else {
    var color = parseInt('3366bb', 16);
    this.addPoint(sx, sy, color);
  }
};

CanvasManager.prototype.draw = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    if (point != undefined) {
      var r = (point >> 16 & 0x0000FF);
      var g = (point >> 8 & 0x0000FF);
      var b = (point & 0x0000FF);
      this.context.fillStyle = 'rgba(' + r +',' + g + ',' + b + ', 0.7)';
      var y = (Math.floor(i / this.pointsx)) * this.pointh;
      var x = (i % this.pointsx) * this.pointw;
      this.context.fillRect(x, y, this.pointw, this.pointh);
    }
  }
};

CanvasManager.prototype.step = function() {
  var modified = false;
  for (var y = this.pointsy - 1; y > 0; y--) {
    for (var x = 0; x < this.pointsx; x++) {
      var point = this.getPoint(x, y);
      var above = this.getPoint(x, y - 1);
      if (above != undefined && point == undefined) {
        var r = (above >> 16 & 0x0000FF);
        var g = (above >> 8 & 0x0000FF);
        var b = (above & 0x0000FF);
        r = Math.max(0, r - 1);
        g = Math.max(0, g - 8);
        b = Math.max(0, b - 8);
        var color = (r << 16) + (g << 8) + b;
        this.addPoint(x, y, color);
        this.clearPoint(x, y - 1);
        modified = true;
      }
    }
  }
  return modified;
};

