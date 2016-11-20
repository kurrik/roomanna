import ShelfBestFit from './common-shelfbestfit';

export default class BestHeightFit {
  heuristic(shelf, word) {
    return shelf.height - word.height; // Score is leftover Y space.
  };

  compare(score, bestScore) {
    return score < bestScore; // Lower is better.
  };

  pack(controls) {
    return ShelfBestFit.pack(controls, this.heuristic, this.compare);
  };
}
