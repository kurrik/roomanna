import chai from 'chai';
import path from 'path';

import SlidingWindow from '../../src/post035/slidingwindow';

const should = chai.should();

describe('SlidingWindow', () => {
  let win;

  beforeEach(() => {
    win = new SlidingWindow(5, SlidingWindow.Max);
  });

  describe('#add', () => {
    it('adds elements', () => {
      should.equal(win.value, null);
      win.add(1);
      win.value.should.equal(1);
      win.add(3);
      win.value.should.equal(3);
      win.add(5);
      win.value.should.equal(5);
      win.add(4);
      win.value.should.equal(5);
      win.add(2);
      win.value.should.equal(5);
      win.add(1);
      win.value.should.equal(5);
      win.add(1);
      win.value.should.equal(5);
      win.add(1);
      win.value.should.equal(4);
      win.add(1);
      win.value.should.equal(2);
      win.add(6);
      win.value.should.equal(6);
    });
  });
});
