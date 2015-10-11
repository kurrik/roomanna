define(['common-shelfbestfit'], function initShelfBestWidthFit(ShelfBestFit) {
  function heuristic(shelf, word) {
    return shelf.remainingX() - word.width; // Score is leftover X space.
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
