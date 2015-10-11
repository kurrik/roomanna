require([
  'jquery',
  'common-controls',
  'common-output',
  'common-random',
  'algorithm-shelfnf',
  'algorithm-shelfff',
  'algorithm-shelfbwf'
], function (
  $,
  Controls,
  Output,
  RandomIft,
  ShelfNextFit,
  ShelfFirstFit,
  ShelfBestWidthFit
) {
  var demoShelfNf = new Output('#demo-shelfnf'),
      demoShelfFf = new Output('#demo-shelfff'),
      demoShelfBwf = new Output('#demo-shelfbwf');

  function onFormChange(controls) {
    demoShelfNf.draw(ShelfNextFit.pack(controls));
    demoShelfFf.draw(ShelfFirstFit.pack(controls));
    demoShelfBwf.draw(ShelfBestWidthFit.pack(controls));
  };

  new Controls(onFormChange);

  $('[data-toggle="tooltip"]').tooltip();
});
