define(['jquery', 'common-packing'], function initShelfNextFit($, Packing) {
  function doesFit(shelfX, wordWidth, maxWidth) {
    return shelfX + wordWidth <= maxWidth;
  };

  function initShelf() {
    return {
      x: 0,
      y: 0,
      height: 0
    };
  };

  function addToShelf(packing, shelf, word, config) {
    if (!doesFit(shelf.x, word.width, config.width)) {
      shelf.x = 0;
      shelf.y += shelf.height;
      shelf.height = 0;
    }
    if (shelf.height < word.height) {
      shelf.height = word.height;
    }
    packing.add(shelf.x, shelf.y, word.width, word.height, word);
    shelf.x += word.width;
  }

  function pack(controls) {
    var i,
        shelf = initShelf(),
        packing;
    packing = new Packing(controls.config.width, 0);
    for (i = 0; i < controls.words.length; i++) {
      addToShelf(packing, shelf, controls.words[i], controls.config);
    }
    packing.extendHeight();
    return packing;
  };

  return {
    pack: pack
  };
});
