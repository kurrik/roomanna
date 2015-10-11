define(['common-shelfbestfit'], function initShelfBestAreaFit(ShelfBestFit) {
  function heuristic(shelf, word) {
    var shelfArea = shelf.remainingX() * shelf.height,
        wordArea = word.width * word.height;
    return shelfArea - wordArea; // Score is leftover area.
  };

  function compare(score, bestScore) {
    return score < bestScore; // Lower is better.
  };

  return {
    pack: function pack(controls) {
      return ShelfBestFit.pack(controls, heuristic, compare);
    }
  };
});


