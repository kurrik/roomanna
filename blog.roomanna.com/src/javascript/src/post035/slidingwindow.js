import Deque from '../common/deque';

class Entry {
  constructor(index, value) {
    this.index = index;
    this.value = value;
  }
}

export default class SlidingWindow {
  constructor(size, compare) {
    this.deque_ = new Deque();
    this.count_ = 0;
    this.size_ = size;
    this.compare_ = compare;
  }

  add(item) {
    let curr = this.deque_.peekTail();
    while (curr && curr.index >= 0 && !this.compare_(curr.value, item)) {
      this.deque_.popTail();
      curr = this.deque_.peekTail();
    }
    this.deque_.pushTail(new Entry(this.count_, item));
    this.count_++;
    curr = this.deque_.peekHead();
    while (curr && curr.index < (this.count_ - this.size_)) {
      this.deque_.popHead();
      curr = this.deque_.peekHead();
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
