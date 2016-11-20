import $ from 'jquery';
import ich from 'icanhaz';

function Output(root) {
  this.$root = $(root);
}

Output.prototype.draw = function draw(packing) {
  packing.calculate();
  this.$root.html(ich.tmplOutput(packing));
};

export default Output;
