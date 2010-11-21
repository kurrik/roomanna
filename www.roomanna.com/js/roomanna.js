function TextMapper(w, h) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = w;
  this.canvas.height = h;
  this.context = this.canvas.getContext('2d');
};

TextMapper.prototype.drawText = function(text) {
  var fontSize = 20;
  var fontName = "LeagueGothic";
  this.context.font = fontSize + 'px ' + fontName;
  var ratio = this.canvas.width / this.context.measureText(text).width;
  this.context.font = Math.round(fontSize * ratio) + 'px ' + fontName;
  this.context.fillStyle = '#000000';
  this.context.fillText(text, 0, this.canvas.height);
};

function Point(x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.color = color;
};

function CanvasManager(w, h) {
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

