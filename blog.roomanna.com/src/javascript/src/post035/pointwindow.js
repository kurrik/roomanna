import SlidingWindow from './slidingwindow';

export default class PointWindow {
  constructor(size) {
    this.minx_ = new SlidingWindow(size, SlidingWindow.Min);
    this.miny_ = new SlidingWindow(size, SlidingWindow.Min);
    this.maxx_ = new SlidingWindow(size, SlidingWindow.Max);
    this.maxy_ = new SlidingWindow(size, SlidingWindow.Max);
  }

  add(x, y) {
    this.minx_.add(x);
    this.maxx_.add(x);
    this.miny_.add(y);
    this.maxy_.add(y);
  }

  get minX() {
    return this.minx_.value || 0;
  }

  get minY() {
    return this.miny_.value || 0;
  }

  get maxX() {
    return this.maxx_.value || 0;
  }

  get maxY() {
    return this.maxy_.value || 0;
  }

  data() {
    return [
      { label: 'minx', data: this.minx_.toArray() },
      { label: 'miny', data: this.miny_.toArray() },
      { label: 'maxx', data: this.maxx_.toArray() },
      { label: 'maxy', data: this.maxy_.toArray() }
    ];
  }
}
