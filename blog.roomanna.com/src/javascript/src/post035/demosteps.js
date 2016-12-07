import Deque from '../common/deque';
import * as d3 from 'd3';

class Entry {
  constructor(index, value) {
    this.index = index;
    this.value = value;
  }
}

class AuditingSlidingWindow {
  constructor(size, compare) {
    this.deque_ = new Deque();
    this.count_ = 0;
    this.size_ = size;
    this.compare_ = compare;
    this.audit_ = [];
  }

  audit() {
    this.audit_.push({
      items: [],
      removeBack: [],
      removeFront: [],
      addBack: []
    });
    return this.audit_[this.audit_.length - 1];
  }

  add(item) {
    let curr = this.deque_.peekTail();
    let line = this.audit();
    line.items = this.toArray();
    line = this.audit();
    while (curr && curr.index >= 0 && !this.compare_(curr.value, item)) {
      line.removeBack.push(this.deque_.popTail());
      curr = this.deque_.peekTail();
    }
    line.items = this.toArray();
    line = this.audit();
    const entry = new Entry(this.count_, item);
    line.addBack = [ entry ];
    this.deque_.pushTail(entry);
    this.count_++;
    line = this.audit();
    curr = this.deque_.peekHead();
    while (curr && curr.index < (this.count_ - this.size_)) {
      line.removeFront.push(this.deque_.popHead());
      curr = this.deque_.peekHead();
    }
    line.items = this.toArray();
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

const win = new AuditingSlidingWindow(5, AuditingSlidingWindow.Min);

win.add(10);
win.add(5);
win.add(8);
console.log(win.audit_);
