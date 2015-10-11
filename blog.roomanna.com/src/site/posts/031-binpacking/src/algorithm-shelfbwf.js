define([
  'jquery',
  'common-packing',
  'common-shelf'
], function initShelfBestWidthFit(
  $,
  Packing,
  Shelf
) {

  function pack(controls) {
    var i,
        j,
        word,
        score,
        shelf,
        bestScore,
        bestShelf,
        shelves = [ new Shelf(controls.config.width) ],
        packing = new Packing(controls.config.width, controls.config.height);
    for (i = 0; i < controls.words.length; i++) {
      word = controls.words[i];
      bestScore = Number.MAX_VALUE;
      bestShelf = -1;
      console.log('new word');
      for (j = 0; j < shelves.length; j++) {
        shelf = shelves[j];
        if (shelf.canAdd(word)) {
          score = shelf.remainingX();
          console.log('shelf', j, 'score', score, 'bestscore', bestScore);
          if (score < bestScore) {
            console.log('updating best score to', score, 'shelf', j);
            bestScore = score;
            bestShelf = j;
          }
        }
      }
      if (bestShelf === -1) {
        shelf = shelves[shelves.length-1].close();
        shelves.push(shelf);
        bestShelf = shelves.length - 1;
      }
      shelf = shelves[bestShelf];
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


