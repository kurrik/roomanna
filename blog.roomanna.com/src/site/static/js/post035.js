(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Item = function Item(value) {
  _classCallCheck(this, Item);

  this.value = value;
  this.next = null;
  this.prev = null;
};

var Deque = function () {
  function Deque() {
    _classCallCheck(this, Deque);

    this.head_ = null;
    this.tail_ = null;
  }

  _createClass(Deque, [{
    key: "pushHead",
    value: function pushHead(i) {
      var item = new Item(i);
      item.next = this.head_;
      if (this.head_) {
        this.head_.prev = item;
      }
      this.head_ = item;
      if (!this.tail_) {
        this.tail_ = item;
      }
    }
  }, {
    key: "pushTail",
    value: function pushTail(i) {
      var item = new Item(i);
      item.prev = this.tail_;
      if (this.tail_) {
        this.tail_.next = item;
      }
      this.tail_ = item;
      if (!this.head_) {
        this.head_ = item;
      }
    }
  }, {
    key: "popHead",
    value: function popHead() {
      var item = this.head_;
      if (item && item.next) {
        this.head_ = item.next;
        item.next.prev = null;
      } else {
        this.head_ = null;
        this.tail_ = null;
      }
      return item && item.value || null;
    }
  }, {
    key: "popTail",
    value: function popTail() {
      var item = this.tail_;
      if (item && item.prev) {
        this.tail_ = item.prev;
        item.prev.next = null;
      } else {
        this.head_ = null;
        this.tail_ = null;
      }
      return item && item.value || null;
    }
  }, {
    key: "peekHead",
    value: function peekHead() {
      return this.head_ && this.head_.value || null;
    }
  }, {
    key: "peekTail",
    value: function peekTail() {
      return this.tail_ && this.tail_.value || null;
    }
  }, {
    key: "filter",
    value: function filter(test) {
      var item = this.head_;
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
  }]);

  return Deque;
}();

exports.default = Deque;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PointWindow = undefined;

var _pointwindow = require('./pointwindow');

var _pointwindow2 = _interopRequireDefault(_pointwindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var windowSize = 5;
var maxPoints = 50;
var halfPt = 6;

var canvas = document.getElementById('canvas');
var w = parseInt(canvas.getAttribute('width'));
var h = parseInt(canvas.getAttribute('height'));
var ctx = canvas.getContext('2d');

var points = [];
var win = new _pointwindow2.default(windowSize);

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (var i = 0; i < points.length; i++) {
    ctx.fillStyle = i < windowSize ? 'rgb(0,200,0)' : 'rgb(200,0,0)';
    ctx.fillRect(points[i][0] - halfPt, points[i][1] - halfPt, halfPt * 2, halfPt * 2);
  }
  var winW = win.maxX - win.minX;
  var winH = win.maxY - win.minY;
  ctx.strokeStyle = 'rgb(0,0,200)';
  ctx.strokeRect(win.minX, win.minY, winW, winH);
}

canvas.addEventListener('click', function (evt) {
  points.splice(0, 0, [evt.offsetX, evt.offsetY]);
  win.add(evt.offsetX, evt.offsetY);
  while (points.length > maxPoints) {
    points.pop();
  }
  draw();
});

exports.PointWindow = _pointwindow2.default;

},{"./pointwindow":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slidingwindow = require('./slidingwindow');

var _slidingwindow2 = _interopRequireDefault(_slidingwindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PointWindow = function () {
  function PointWindow(size) {
    _classCallCheck(this, PointWindow);

    this.minx_ = new _slidingwindow2.default(size, _slidingwindow2.default.Min);
    this.miny_ = new _slidingwindow2.default(size, _slidingwindow2.default.Min);
    this.maxx_ = new _slidingwindow2.default(size, _slidingwindow2.default.Max);
    this.maxy_ = new _slidingwindow2.default(size, _slidingwindow2.default.Max);
  }

  _createClass(PointWindow, [{
    key: 'add',
    value: function add(x, y) {
      this.minx_.add(x);
      this.maxx_.add(x);
      this.miny_.add(y);
      this.maxy_.add(y);
    }
  }, {
    key: 'minX',
    get: function get() {
      return this.minx_.value || 0;
    }
  }, {
    key: 'minY',
    get: function get() {
      return this.miny_.value || 0;
    }
  }, {
    key: 'maxX',
    get: function get() {
      return this.maxx_.value || 0;
    }
  }, {
    key: 'maxY',
    get: function get() {
      return this.maxy_.value || 0;
    }
  }]);

  return PointWindow;
}();

exports.default = PointWindow;

},{"./slidingwindow":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _deque = require('../common/deque');

var _deque2 = _interopRequireDefault(_deque);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entry = function Entry(index, value) {
  _classCallCheck(this, Entry);

  this.index = index;
  this.value = value;
};

var SlidingWindow = function () {
  function SlidingWindow(size, compare) {
    _classCallCheck(this, SlidingWindow);

    this.deque_ = new _deque2.default();
    this.count_ = 0;
    this.size_ = size;
    this.compare_ = compare;
  }

  _createClass(SlidingWindow, [{
    key: 'add',
    value: function add(item) {
      var _this = this;

      this.deque_.filter(function (x) {
        return _this.compare_(x.value, item);
      });
      this.deque_.pushTail(new Entry(this.count_, item));
      this.count_++;
      var head = this.deque_.peekHead();
      while (head && head.index < this.count_ - this.size_) {
        this.deque_.popHead();
        head = this.deque_.peekHead();
      }
    }
  }, {
    key: 'value',
    get: function get() {
      var head = this.deque_.peekHead();
      return head && head.value || null;
    }
  }], [{
    key: 'Max',
    value: function Max(a, b) {
      return a > b;
    }
  }, {
    key: 'Min',
    value: function Min(a, b) {
      return a < b;
    }
  }]);

  return SlidingWindow;
}();

exports.default = SlidingWindow;

},{"../common/deque":1}]},{},[2]);

//# sourceMappingURL=post035.js.map
