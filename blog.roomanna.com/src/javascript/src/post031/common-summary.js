import $ from 'jquery';
import ich from 'icanhaz';

function Summary(root) {
  this.$root = $(root);
  this.demos = [];
}

Summary.prototype.draw = function draw() {
  this.$root.html(ich.tmplSummary({
    demos: this.demos
  }));
  this.demos = [];
};

Summary.prototype.add = function add(label, metrics) {
  this.demos.push({
    label: label,
    metrics: metrics
  });
};

export default Summary;
