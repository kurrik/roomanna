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
    this.deque_.filter((x) => this.compare_(x.value, item));
    this.deque_.pushTail(new Entry(this.count_, item));
    this.count_++;
    let head = this.deque_.peekHead();
    while (head && head.index < (this.count_ - this.size_)) {
      this.deque_.popHead();
      head = this.deque_.peekHead();
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
