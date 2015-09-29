define(['jquery'], function ShelfNextFit($) {
  function pow2(input) {
    return Math.pow(2, Math.ceil(Math.log2(input)));
  };

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

  function addToShelf(shelf, word, config) {
    var output;
    if (!doesFit(shelf.x, word.width, config.width)) {
      shelf.x = 0;
      shelf.y += shelf.height;
      shelf.height = 0;
    }
    if (shelf.height < word.height) {
      shelf.height = word.height;
    }
    output = $.extend({}, word, {
      x: shelf.x,
      y: shelf.y
    });
    shelf.x += word.width;
    return output;
  }

  function pack(config) {
    var i,
        shelf = initShelf(),
        output;
    output = {
      width: config.width,
      words: []
    };
    for (i = 0; i < config.words.length; i++) {
      output.words.push(addToShelf(shelf, config.words[i], config))
    }
    output.height = pow2(shelf.y + shelf.height);
    return output;
  };

  return {
    pack: pack
  };
});
