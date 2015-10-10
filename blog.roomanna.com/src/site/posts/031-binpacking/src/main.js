require([
  'jquery',
  'common-controls',
  'common-output',
  'common-random',
  'algorithm-shelfnf',
  'algorithm-shelfff'
], function (
  $,
  Controls,
  Output,
  RandomIft,
  ShelfNextFit,
  ShelfFirstFit
) {
  var demoShelfNf = new Output('#demo-shelfnf'),
      demoShelfFf = new Output('#demo-shelfff');

  function onFormChange(controls) {
    demoShelfNf.draw(ShelfNextFit.pack(controls));
    demoShelfFf.draw(ShelfFirstFit.pack(controls));
  };

  new Controls(onFormChange);

  $('[data-toggle="tooltip"]').tooltip();
});
