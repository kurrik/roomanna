define(['common-shelfbestfit'], function initShelfBestHeightFit(ShelfBestFit) {
  function heuristic(shelf, word) {
    return shelf.height - word.height; // Score is leftover Y space.
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
