class Item {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export default class Deque {
  constructor() {
    this.head_ = null;
    this.tail_ = null;
  }

  pushHead(i) {
    const item = new Item(i);
    item.next = this.head_;
    if (this.head_) {
      this.head_.prev = item;
    }
    this.head_ = item;
    if (!this.tail_) {
      this.tail_ = item;
    }
  }

  pushTail(i) {
    const item = new Item(i);
    item.prev = this.tail_;
    if (this.tail_) {
      this.tail_.next = item;
    }
    this.tail_ = item;
    if (!this.head_) {
      this.head_ = item;
    }
  }

  popHead() {
    const item = this.head_;
    if (item && item.next) {
      this.head_ = item.next;
      item.next.prev = null;
    } else {
      this.head_ = null;
      this.tail_ = null;
    }
    return item && item.value || null;
  }

  popTail() {
    const item = this.tail_;
    if (item && item.prev) {
      this.tail_ = item.prev;
      item.prev.next = null;
    } else {
      this.head_ = null;
      this.tail_ = null;
    }
    return item && item.value || null;
  }

  peekHead() {
    return this.head_ && this.head_.value || null;
  }

  peekTail() {
    return this.tail_ && this.tail_.value || null;
  }

  filter(test) {
    let item = this.head_;
    while (item !== null) {
      if (test(item.value) === false) {
        if (item.prev === null) {
          this.head_ = item.next;
        } else {
          item.prev.next = item.next;
        }
        if (item.next === null) {
          this.tail_ = item.prev;
        } else {
          item.next.prev = item.prev;
        }
      }
      item = item.next;
    }
  }
}
