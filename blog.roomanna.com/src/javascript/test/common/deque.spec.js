import chai from 'chai';
import path from 'path';

import Deque from '../../src/common/deque';

const should = chai.should();

function dequeElements(deque) {
  let elems = [];
  let item;
  for (item = deque.head_; item != null; item = item.next) {
    elems.push(item.value);
  }
  return elems;
}

describe('Deque', () => {
  let deque;

  beforeEach(() => {
    deque = new Deque();
  });

  describe('#pushHead', () => {
    it('adds elements', () => {
      deque.pushHead('one');
      deque.pushHead('two');
      deque.pushHead('three');
      const elems = dequeElements(deque);
      elems.should.deep.equal(['three', 'two', 'one']);
    });

    it('sets head_ correctly when the first element is pushed', () => {
      deque.pushHead('one');
      deque.head_.value.should.equal('one');
    });

    it('sets head_ correctly when multiple elements are pushed', () => {
      deque.pushHead('one');
      deque.pushHead('two');
      deque.head_.value.should.equal('two');
    });

    it('sets tail_ correctly when the first element is pushed', () => {
      deque.pushHead('one');
      deque.tail_.value.should.equal('one');
    });

    it('sets tail_ correctly when multiple elements are pushed', () => {
      deque.pushHead('one');
      deque.pushHead('two');
      deque.tail_.value.should.equal('one');
    });
  });

  describe('#pushTail', () => {
    it('adds elements', () => {
      deque.pushTail('one');
      deque.pushTail('two');
      deque.pushTail('three');
      const elems = dequeElements(deque);
      elems.should.deep.equal(['one', 'two', 'three']);
    });

    it('sets head_ correctly when the first element is pushed', () => {
      deque.pushTail('one');
      deque.head_.value.should.equal('one');
    });

    it('sets head_ correctly when multiple elements are pushed', () => {
      deque.pushTail('one');
      deque.pushTail('two');
      deque.head_.value.should.equal('one');
    });

    it('sets tail_ correctly when the first element is pushed', () => {
      deque.pushTail('one');
      deque.tail_.value.should.equal('one');
    });

    it('sets tail_ correctly when multiple elements are pushed', () => {
      deque.pushTail('one');
      deque.pushTail('two');
      deque.tail_.value.should.equal('two');
    });
  });

  describe('#popHead', () => {
    beforeEach(() => {
      deque.pushTail('one');
      deque.pushTail('two');
      deque.pushTail('three');
    });

    it('removes elements', () => {
      const value = deque.popHead();
      value.should.equal('one');
      const elems = dequeElements(deque);
      elems.should.deep.equal(['two', 'three']);
    });

    it('removes all elements', () => {
      deque.popHead();
      deque.popHead();
      deque.popHead();
      const elems = dequeElements(deque);
      elems.should.deep.equal([]);
    });

    it('sets head_ correctly when one element is popped', () => {
      deque.popHead();
      deque.head_.value.should.equal('two');
    });

    it('sets head_ correctly when all but the last element is popped', () => {
      deque.popHead();
      deque.popHead();
      deque.head_.value.should.equal('three');
    });

    it('sets head_ correctly when all elements are popped', () => {
      deque.popHead();
      deque.popHead();
      deque.popHead();
      should.not.exist(deque.head_);
    });

    it('sets tail_ correctly when one element is popped', () => {
      deque.popHead();
      deque.tail_.value.should.equal('three');
    });

    it('sets tail_ correctly when all but the last element is popped', () => {
      deque.popHead();
      deque.popHead();
      deque.tail_.value.should.equal('three');
    });

    it('sets tail_ correctly when all elements are popped', () => {
      deque.popHead();
      deque.popHead();
      deque.popHead();
      should.not.exist(deque.tail_);
    });

    it('returns null when all elements are popped', () => {
      deque.popHead();
      deque.popHead();
      deque.popHead();
      const value = deque.popHead();
      should.equal(value, null);
    });
  });

  describe('#popTail', () => {
    beforeEach(() => {
      deque.pushTail('one');
      deque.pushTail('two');
      deque.pushTail('three');
    });

    it('removes elements', () => {
      const value = deque.popTail();
      value.should.equal('three');
      const elems = dequeElements(deque);
      elems.should.deep.equal(['one', 'two']);
    });

    it('removes all elements', () => {
      deque.popTail();
      deque.popTail();
      deque.popTail();
      const elems = dequeElements(deque);
      elems.should.deep.equal([]);
    });

    it('sets head_ correctly when one element is popped', () => {
      deque.popTail();
      deque.head_.value.should.equal('one');
    });

    it('sets head_ correctly when all but the last element is popped', () => {
      deque.popTail();
      deque.popTail();
      deque.head_.value.should.equal('one');
    });

    it('sets head_ correctly when all elements are popped', () => {
      deque.popTail();
      deque.popTail();
      deque.popTail();
      should.not.exist(deque.head_);
    });

    it('sets tail_ correctly when one element is popped', () => {
      deque.popTail();
      deque.tail_.value.should.equal('two');
    });

    it('sets tail_ correctly when all but the last element is popped', () => {
      deque.popTail();
      deque.popTail();
      deque.tail_.value.should.equal('one');
    });

    it('sets tail_ correctly when all elements are popped', () => {
      deque.popTail();
      deque.popTail();
      deque.popTail();
      should.not.exist(deque.tail_);
    });

    it('returns null when all elements are popped', () => {
      deque.popTail();
      deque.popTail();
      deque.popTail();
      const value = deque.popTail();
      should.equal(value, null);
    });
  });

  describe('#filter', () => {
    beforeEach(() => {
      deque.pushTail(1);
      deque.pushTail(3);
      deque.pushTail(5);
      deque.pushTail(4);
      deque.pushTail(2);
    });

    it('removes items which do not pass the filter', () => {
      deque.filter((x) => x > 2);
      const elems = dequeElements(deque);
      elems.should.deep.equal([3, 5, 4]);
      should.equal(deque.head_.value, 3);
      should.equal(deque.tail_.value, 4);
    });

    it('can remove all items', () => {
      deque.filter((x) => x > 10);
      const elems = dequeElements(deque);
      elems.should.deep.equal([]);
      should.equal(deque.head_, null);
      should.equal(deque.tail_, null);
    });

    it('can remove no items', () => {
      deque.filter((x) => x > 0);
      const elems = dequeElements(deque);
      elems.should.deep.equal([1, 3, 5, 4, 2]);
      should.equal(deque.head_.value, 1);
      should.equal(deque.tail_.value, 2);
    });

    it('can remove the first item', () => {
      deque.filter((x) => x !== 1);
      const elems = dequeElements(deque);
      elems.should.deep.equal([3, 5, 4, 2]);
      should.equal(deque.head_.value, 3);
      should.equal(deque.tail_.value, 2);
    });

    it('can remove the last item', () => {
      deque.filter((x) => x !== 2);
      const elems = dequeElements(deque);
      elems.should.deep.equal([1, 3, 5, 4]);
      should.equal(deque.head_.value, 1);
      should.equal(deque.tail_.value, 4);
    });
  });

  describe('#peekHead', () => {
    it('returns null for empty deques', () => {
      const value = deque.peekHead();
      should.equal(value, null);
    });

    it('returns the first item for deques with one item', () => {
      deque.pushTail('one');
      const value = deque.peekHead();
      value.should.equal('one');
    });

    it('returns the first item for deques with more than one item', () => {
      deque.pushTail('one');
      deque.pushTail('two');
      const value = deque.peekHead();
      value.should.equal('one');
    });
  });

  describe('#peekTail', () => {
    it('returns null for empty deques', () => {
      const value = deque.peekTail();
      should.equal(value, null);
    });

    it('returns the last item for deques with one item', () => {
      deque.pushTail('one');
      const value = deque.peekTail();
      value.should.equal('one');
    });

    it('returns the last item for deques with more than one item', () => {
      deque.pushTail('one');
      deque.pushTail('two');
      const value = deque.peekTail();
      value.should.equal('two');
    });
  });
});
