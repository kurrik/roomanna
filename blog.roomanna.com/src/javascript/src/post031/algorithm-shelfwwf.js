import ShelfBestFit from './common-shelfbestfit';

export default class ShelfWorstWidthFit {
  heuristic(shelf, word) {
    if (shelf.remainingX() === word.width) {
      return Number.MAX_VALUE; // Immediately pick this fit.
    }
    return shelf.remainingX() - word.width; // Score is leftover X space.
  };

  compare(score, bestScore) {
    return score > bestScore; // Higher is better.
  };

  pack(controls) {
    return ShelfBestFit.pack(controls, this.heuristic, this.compare);
  };
}
