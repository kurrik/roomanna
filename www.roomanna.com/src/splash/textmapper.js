export default function TextMapper(w, h) {
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
