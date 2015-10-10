define(['jquery', 'icanhaz'], function initOutput($, ich) {
  function Output(root) {
    this.$root = $(root);
  }

  Output.prototype.draw = function draw(packing) {
    packing.calculate();
    this.$root.html(ich.tmplOutput(packing));
  };

  return Output;
});
