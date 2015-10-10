define([
  'jquery',
  'common-packing',
  'common-shelf'
], function initShelfNextFit(
  $,
  Packing,
  Shelf
) {

  function pack(controls) {
    var i,
        word,
        shelf = new Shelf(controls.config.width),
        packing = new Packing(controls.config.width, 0);
    for (i = 0; i < controls.words.length; i++) {
      word = controls.words[i];
      if (!shelf.canAdd(word)) {
        shelf = shelf.close();
      }
      packing.add(shelf.x, shelf.y, word.width, word.height, word);
      shelf.add(word);
    }
    packing.extendHeight();
    return packing;
  };

  return {
    pack: pack
  };
});
