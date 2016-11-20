import Packing from './common-packing';
import Shelf from './common-shelf';

export default class ShelfBestFit {
  static pack(controls, heuristic, compare) {
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
      bestScore = false;
      bestShelf = -1;
      for (j = 0; j < shelves.length; j++) {
        shelf = shelves[j];
        if (shelf.canAdd(word)) {
          score = heuristic(shelf, word);
          if (bestScore === false || compare(score, bestScore)) {
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
    return packing;
  };
}
