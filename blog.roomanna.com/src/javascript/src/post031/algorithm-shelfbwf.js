import ShelfBestFit from './common-shelfbestfit';

export default class ShelfBestWidthFit {
  heuristic(shelf, word) {
    return shelf.remainingX() - word.width; // Score is leftover X space.
  };

  compare(score, bestScore) {
    return score < bestScore; // Lower is better.
  };

  pack(controls) {
    return ShelfBestFit.pack(controls, this.heuristic, this.compare);
  };
}
