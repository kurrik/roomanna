import chai from 'chai';
import path from 'path';

import PointWindow from '../src/pointwindow';

const should = chai.should();

describe('PointWindow', () => {
  let win;

  beforeEach(() => {
    win = new PointWindow(5);
  });

  function check(points, expected, assign, check) {
    for (let i = 0; i < points.length; i++) {
      assign(points[i]);
      check().should.equal(expected[i], `mismatch at index ${i}`);
    }
  }

  describe('#minX', () => {
    function checkMinX(points, expected) {
      check(points, expected, (x) => win.add(x, 0), () => win.minX);
    }

    it('should return 0 if no points have been added', () => {
      win.minX.should.equal(0);
    });

    it('should return the minimum as points are added', () => {
      checkMinX(
        [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1,9,8,7,6,5],
        [1,1,1,1,1,2,3,4,5,6,5,4,3,2,1,1,1,1,1,5]);
    });
  });

  describe('#maxX', () => {
    function checkMaxX(points, expected) {
      check(points, expected, (x) => win.add(x, 0), () => win.maxX);
    }

    it('should return 0 if no points have been added', () => {
      win.maxX.should.equal(0);
    });

    it('should return the maximum as points are added', () => {
      checkMaxX(
        [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1,9,8,7,6,5],
        [1,2,3,4,5,6,7,8,8,8,8,8,7,6,5,9,9,9,9,9]);
    });
  });

  describe('#minY', () => {
    function checkMinY(points, expected) {
      check(points, expected, (y) => win.add(0, y), () => win.minY);
    }

    it('should return 0 if no points have been added', () => {
      win.minY.should.equal(0);
    });

    it('should return the minimum as points are added', () => {
      checkMinY(
        [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1,9,8,7,6,5],
        [1,1,1,1,1,2,3,4,5,6,5,4,3,2,1,1,1,1,1,5]);
    });
  });

  describe('#maxY', () => {
    function checkMaxY(points, expected) {
      check(points, expected, (y) => win.add(0, y), () => win.maxY);
    }

    it('should return 0 if no points have been added', () => {
      win.maxY.should.equal(0);
    });

    it('should return the maximum as points are added', () => {
      checkMaxY(
        [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1,9,8,7,6,5],
        [1,2,3,4,5,6,7,8,8,8,8,8,7,6,5,9,9,9,9,9]);
    });
  });
});
