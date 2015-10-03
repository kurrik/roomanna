define([], function initPacking() {
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

  function Packing(width, height) {
    this.items = [];
    this.width = width;
    this.height = height;
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

  return Packing;
});

