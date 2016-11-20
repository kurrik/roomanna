function pow2(input) {
  return Math.pow(2, Math.ceil(Math.log2(input)));
};

function max(items, accessor) {
  var i,
      value,
      max = 0;
  for (i = 0; i < items.length; i++) {
    value = accessor(items[i]);
    if (value > max) { max = value; }
  }
  return max;
};

function percent(ratio) {
  return Math.round(ratio * 10000) / 100;
};

function Packing(width, height) {
  this.items = [];
  this.width = width;
  this.height = height;
  this.metrics = {};
};

Packing.prototype.add = function add(x, y, width, height, data) {
  this.items.push({
    x: x,
    y: y,
    width: width,
    height: height,
    data: data
  });
};

Packing.prototype.extendHeight = function extendHeight() {
  this.height = pow2(max(this.items, function(i) { return i.y + i.height; }));
};

Packing.prototype.extendWidth = function extendHeight() {
  this.width = pow2(max(this.items, function(i) { return i.x + i.width; }));
};

Packing.prototype.calculate = function calculate() {
  var i,
      filledWidth,
      filledHeight,
      filledArea,
      itemArea,
      item;
  this.metrics.canvasArea = this.width * this.height;
  this.metrics.itemArea = 0;
  this.metrics.filledArea = 0;
  this.metrics.overflowedArea = 0;
  this.metrics.firstClipped = 0;
  for (i = 0; i < this.items.length; i++) {
    item = this.items[i];
    itemArea = item.width * item.height;
    filledWidth = Math.max(0, Math.min(item.width, this.width - item.x));
    filledHeight = Math.max(0, Math.min(item.height, this.height - item.y));
    filledArea = filledWidth * filledHeight;
    if (itemArea != filledArea && this.metrics.firstClipped === 0) {
      this.metrics.firstClipped = i;
    }
    this.metrics.itemArea += itemArea;
    this.metrics.filledArea += filledArea;
    this.metrics.overflowedArea += (itemArea - filledArea);
  }
  this.metrics.filledRatio = this.metrics.filledArea / this.metrics.canvasArea;
  this.metrics.overflowedRatio = this.metrics.overflowedArea / this.metrics.itemArea;
  this.metrics.filledPercent = percent(this.metrics.filledRatio);
  this.metrics.overflowedPercent = percent(this.metrics.overflowedRatio);
};

export default Packing;
