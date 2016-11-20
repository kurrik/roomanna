import $ from 'jquery';
import bootstrap from 'bootstrap';
import Controls from './common-controls';
import Output from './common-output';
import Summary from './common-summary';
import ShelfNextFit from './algorithm-shelfnf';
import ShelfFirstFit from './algorithm-shelfff';
import ShelfBestHeightFit from './algorithm-shelfbhf';
import ShelfBestWidthFit from './algorithm-shelfbwf';
import ShelfBestAreaFit from './algorithm-shelfbaf';
import ShelfWorstWidthFit from './algorithm-shelfwwf';

var summary = new Summary('#Summary'),
    demos;

demos = [
  {
    label: 'Shelf Next Fit',
    output: new Output('#demo-shelfnf'),
    packer: new ShelfNextFit()
  },
  {
    label: 'Shelf First Fit',
    output: new Output('#demo-shelfff'),
    packer: new ShelfFirstFit()
  },
  {
    label: 'Shelf Best Width Fit',
    output: new Output('#demo-shelfbwf'),
    packer: new ShelfBestWidthFit()
  },
  {
    label: 'Shelf Best Height Fit',
    output: new Output('#demo-shelfbhf'),
    packer: new ShelfBestHeightFit()
  },
  {
    label: 'Shelf Best Area Fit',
    output: new Output('#demo-shelfbaf'),
    packer: new ShelfBestAreaFit()
  },
  {
    label: 'Shelf Worst Width Fit',
    output: new Output('#demo-shelfwwf'),
    packer: new ShelfWorstWidthFit()
  }
];

function onFormChange(controls) {
  var i,
      demo,
      packing;
  for (i = 0; i < demos.length; i++) {
    demo = demos[i];
    packing = demo.packer.pack(controls);
    demo.output.draw(packing);
    summary.add(demo.label, packing.metrics);
  };
  summary.draw();
};

$(document).ready(function () {
  new Controls(onFormChange);
  $('[data-toggle="tooltip"]').tooltip();
});
