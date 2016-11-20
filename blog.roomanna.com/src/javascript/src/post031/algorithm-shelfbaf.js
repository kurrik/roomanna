import ShelfBestFit from './common-shelfbestfit';

export default class ShelfBestAreaFit {
  heuristic(shelf, word) {
    var shelfArea = shelf.remainingX() * shelf.height,
        wordArea = word.width * word.height;
    return shelfArea - wordArea; // Score is leftover area.
  };

  compare(score, bestScore) {
    return score < bestScore; // Lower is better.
  };

  pack(controls) {
    return ShelfBestFit.pack(controls, this.heuristic, this.compare);
  };
}
