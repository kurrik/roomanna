require([
  'jquery',
  'common-controls',
  'common-output',
  'common-summary',
  'algorithm-shelfnf',
  'algorithm-shelfff',
  'algorithm-shelfbwf',
  'algorithm-shelfbhf',
  'algorithm-shelfbaf',
  'algorithm-shelfwwf'
], function (
  $,
  Controls,
  Output,
  Summary,
  ShelfNextFit,
  ShelfFirstFit,
  ShelfBestWidthFit,
  ShelfBestHeightFit,
  ShelfBestAreaFit,
  ShelfWorstWidthFit
) {
  var summary = new Summary('#Summary'),
      demos;

  demos = [
    {
      label: 'Shelf Next Fit',
      output: new Output('#demo-shelfnf'),
      packer: ShelfNextFit
    },
    {
      label: 'Shelf First Fit',
      output: new Output('#demo-shelfff'),
      packer: ShelfFirstFit
    },
    {
      label: 'Shelf Best Width Fit',
      output: new Output('#demo-shelfbwf'),
      packer: ShelfBestWidthFit
    },
    {
      label: 'Shelf Best Height Fit',
      output: new Output('#demo-shelfbhf'),
      packer: ShelfBestHeightFit
    },
    {
      label: 'Shelf Best Area Fit',
      output: new Output('#demo-shelfbaf'),
      packer: ShelfBestAreaFit
    },
    {
      label: 'Shelf Worst Width Fit',
      output: new Output('#demo-shelfwwf'),
      packer: ShelfWorstWidthFit
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

  new Controls(onFormChange);

  $('[data-toggle="tooltip"]').tooltip();
});
