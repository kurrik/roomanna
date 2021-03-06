import Packing from './common-packing';
import Shelf from './common-shelf';

export default class ShelfNextFit {
  pack(controls) {
    var i,
        word,
        shelf = new Shelf(controls.config.width),
        packing = new Packing(controls.config.width, controls.config.height);
    for (i = 0; i < controls.words.length; i++) {
      word = controls.words[i];
      if (!shelf.canAdd(word)) {
        shelf = shelf.close();
      }
      packing.add(shelf.x, shelf.y, word.width, word.height, word);
      shelf.add(word);
    }
    return packing;
  };
}
