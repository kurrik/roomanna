function Shelf(maxWidth) {
  this.x = 0;
  this.y = 0;
  this.height = 0;
  this.maxWidth = maxWidth;
  this.isOpen = true;
};

Shelf.prototype.fitsX = function fitsX(wordWidth) {
  return this.x + wordWidth <= this.maxWidth;
};

Shelf.prototype.fitsY = function fitsY(wordHeight) {
  return this.height >= wordHeight;
}

Shelf.prototype.remainingX = function remainingX() {
  return this.maxWidth - this.x;
};

Shelf.prototype.canAdd = function canAdd(word) {
  if (!this.fitsX(word.width)) {
    return false;
  }
  // Only allow adding words which exceed height if the shelf is open.
  if (!this.isOpen && !this.fitsY(word.height)) {
    return false;
  }
  return true;
};

Shelf.prototype.add = function add(word) {
  if (this.height < word.height) {
    this.height = word.height;
  }
  this.x += word.width;
};

// Returns the next shelf.  Now height of this shelf cannot be extended.
Shelf.prototype.close = function close() {
  var shelf = new Shelf(this.maxWidth);
  shelf.y = this.y + this.height;
  this.isOpen = false;
  return shelf;
};

export default Shelf;
