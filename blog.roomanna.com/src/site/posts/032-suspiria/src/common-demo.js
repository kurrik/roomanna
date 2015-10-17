define(['jquery'], function ($) {
  function Demo(root) {
    var demo = this;
    this.$root = $(root);
    this.state = {};
    this.listeners = [];
    this.$root.find('[data-binding]').change(function onChange(evt) {
      var $target = $(this),
          key = $target.attr('data-binding'),
          value = parseFloat($target.val());
      if (demo.state[key] !== value) {
        demo.state[key] = value;
        demo.renderState(key);
        demo.callListeners();
      }
    });
  }

  Demo.prototype.setState = function setState(state) {
    var key,
        changed = false;
    for (key in state) {
      if (state.hasOwnProperty(key)) {
        if (this.state[key] !== state[key]) {
          changed = true;
          this.state[key] = state[key];
          this.renderState(key);
        }
      }
    }
    if (changed) {
      this.callListeners();
    }
  };

  Demo.prototype.addListener = function addListener(callback) {
    this.listeners.push(callback);
  };

  Demo.prototype.callListeners = function callListeners() {
    for (i = 0; i < this.listeners.length; i++) {
      this.listeners[i](this);
    }
  };

  Demo.prototype.renderState = function renderState(key) {
    var i,
        value = this.state[key];
    this.$root.find('[data-display=' + key + ']').text(value);
    this.$root.find('[data-binding=' + key + ']').val(value);
  };

  return Demo;
});
