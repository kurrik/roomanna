webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _animated = __webpack_require__(60);
	
	var _animated2 = _interopRequireDefault(_animated);
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _bootstrap = __webpack_require__(2);
	
	var _bootstrap2 = _interopRequireDefault(_bootstrap);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(0, _jquery2.default)('.tooltip-trigger').tooltip();
	_animated2.default.init();

/***/ },

/***/ 60:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var AnimatedImage = function () {
	  function AnimatedImage() {
	    _classCallCheck(this, AnimatedImage);
	  }
	
	  _createClass(AnimatedImage, null, [{
	    key: 'init',
	    value: function init() {
	      function imgInit() {
	        var img = (0, _jquery2.default)(this),
	            icon = (0, _jquery2.default)('<div class="animating-icon">&#x25b6;</div>'),
	            wrap = (0, _jquery2.default)('<div class="animating-wrap"></div>');
	        img.attr('data-poster', img.attr('src'));
	        wrap.width(img.width());
	        img.wrap(wrap);
	        img.after(icon);
	      };
	
	      function pauseItem() {
	        var wrap = (0, _jquery2.default)(this),
	            img = wrap.find('img');
	        img.attr('src', img.attr('data-poster'));
	        wrap.find('.animating-icon').show();
	        wrap.removeClass('playing');
	      };
	
	      function playItem() {
	        var wrap = (0, _jquery2.default)(this),
	            img = wrap.find('img');
	        img.attr('src', img.attr('data-animated'));
	        wrap.find('.animating-icon').hide();
	        wrap.addClass('playing');
	      };
	
	      function toggleItem() {
	        var wrap = (0, _jquery2.default)(this),
	            isPlaying = wrap.hasClass('playing');
	        (0, _jquery2.default)('.animating-wrap.playing').each(pauseItem);
	        if (!isPlaying) {
	          playItem.apply(this);
	        }
	      };
	
	      (0, _jquery2.default)('[data-animated]').map(imgInit);
	      (0, _jquery2.default)('.animating-wrap').click(toggleItem).mouseenter(playItem).mouseleave(pauseItem);
	    }
	  }]);
	
	  return AnimatedImage;
	}();
	
	exports.default = AnimatedImage;

/***/ }

});
//# sourceMappingURL=roomanna.js.map