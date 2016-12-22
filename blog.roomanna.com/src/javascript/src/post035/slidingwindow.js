import Deque from '../common/deque';
import 'babel-polyfill';

function copyObject(obj, state) {
  return Object.assign({}, obj, { state: state });
}

export default class SlidingWindow {
  constructor(size, compare) {
    this.deque_ = new Deque();
    this.count_ = 0;
    this.size_ = size;
    this.compare_ = compare;
    this.stepIndex_ = 0;
  }

  add(item) {
    for (let value of this.step(item)) {}
  }

  *step(item, audit) {
    const entry = {
      'index': this.count_,
      'value': item,
      'state': ''
    };
    if (audit) {
      yield {
        'index': this.stepIndex_++,
        'label': `Adding item #${this.count_} with value ${item}...`,
        'data': [ ...this.toArray(), copyObject(entry, 'added') ],
      };
    }
    let curr = this.deque_.peekTail();
    let removedItems = [];
    let removedItem;
    while (curr && curr.index >= 0 && !this.compare_(curr.value, item)) {
      removedItem = this.deque_.popTail();
      if (audit) {
        removedItems.unshift(copyObject(removedItem, 'removed'));
      }
      curr = this.deque_.peekTail();
    }
    if (audit && removedItems.length > 0) {
      const removed = removedItems.map((x) => x.value).join(',');
      const valueLabel = removedItems.length == 1 ? 'value' : 'values';
      const itemsLabel = removedItems.length == 1 ? 'item' : 'items';
      yield {
        'index': this.stepIndex_++,
        'label': `Remove tail ${itemsLabel} with ${valueLabel} ${removed}`,
        'data': [ ...this.toArray(), ...removedItems, copyObject(entry, 'added') ]
      };
    }
    this.deque_.pushTail(entry);
    this.count_++;
    if (audit) {
      yield {
        'index': this.stepIndex_++,
        'label': `Push ${item} to tail`,
        'data': [ ...this.toArray() ],
      };
    }
    curr = this.deque_.peekHead();
    removedItems = [];
    while (curr && curr.index < (this.count_ - this.size_)) {
      removedItem = this.deque_.popHead();
      if (audit) {
        removedItems.unshift(copyObject(removedItem, 'removed'));
      }
      curr = this.deque_.peekHead();
    }
    if (audit && removedItems.length > 0) {
      yield {
        'index': this.stepIndex_++,
        'label': `Remove head indices outside of [${this.count_ - this.size_}...${this.count_-1}]`,
        'data': [ ...removedItems, ...this.toArray() ]
      };
    }
  }

  get value() {
    let head = this.deque_.peekHead();
    return head && head.value || null;
  }

  toArray() {
    return this.deque_.toArray();
  }

  static Max(a,b) { return a > b };
  static Min(a,b) { return a < b };
}
