define(['common-shelfbestfit'], function initShelfWorstWidthFit(ShelfBestFit) {
  function heuristic(shelf, word) {
    if (shelf.remainingX() === word.width) {
      return Number.MAX_VALUE; // Immediately pick this fit.
    }
    return shelf.remainingX() - word.width; // Score is leftover X space.
  };

  function compare(score, bestScore) {
    return score > bestScore; // Higher is better.
  };

  return {
    pack: function pack(controls) {
      return ShelfBestFit.pack(controls, heuristic, compare);
    }
  };
});
