define([
  'jquery',
  'common-packing',
  'common-shelf'
], function initShelfFirstFit(
  $,
  Packing,
  Shelf
) {

  function pack(controls) {
    var i,
        j,
        word,
        shelf,
        placed,
        shelves = [ new Shelf(controls.config.width) ],
        packing = new Packing(controls.config.width, controls.config.height);
    for (i = 0; i < controls.words.length; i++) {
      placed = false;
      word = controls.words[i];
      for (j = 0; j < shelves.length; j++) {
        shelf = shelves[j];
        if (!placed && shelf.canAdd(word)) {
          packing.add(shelf.x, shelf.y, word.width, word.height, word);
          shelf.add(word);
          placed = true;
        }
      }
      if (!placed) {
        shelf = shelves[shelves.length-1].close();
        shelves.push(shelf);
        packing.add(shelf.x, shelf.y, word.width, word.height, word);
        shelf.add(word);
      }
    }
    packing.extendHeight();
    return packing;
  };

  return {
    pack: pack
  };
});

