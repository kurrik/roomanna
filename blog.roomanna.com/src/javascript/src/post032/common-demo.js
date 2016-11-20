define(['jquery'], function ($) {
  function Demo(root) {
    var demo = this;
    this.$root = $(root);
    this.state = {};
    this.listeners = [];
    this.listenerTimeout = null;
    function onInput(evt) {
      var $target = $(evt.target),
          key = $target.attr('data-binding'),
          value = parseFloat($target.val());
      if (demo.state[key] !== value) {
        demo.state[key] = value;
        demo.renderState(key);
      }
    }
    function onChange(evt) {
      onInput(evt);
      demo.callListeners();
    }
    this.$root.find('[data-binding]')
      .on('input', onInput)
      .change(onChange);
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
    var demo = this;
    if (this.listenerTimeout != null) {
      window.clearTimeout(this.listenerTimeout);
    }
    this.listenerTimeout = window.setTimeout(function onTimeout() {
      var i;
      demo.listenerTimeout = null;
      for (i = 0; i < demo.listeners.length; i++) {
        demo.listeners[i](demo);
      }
    }, 100);
  };

  Demo.prototype.renderState = function renderState(key) {
    var i,
        value = this.state[key];
    this.$root.find('[data-display=' + key + ']').text(value);
    this.$root.find('[data-binding=' + key + ']').val(value);
  };

  return Demo;
});
