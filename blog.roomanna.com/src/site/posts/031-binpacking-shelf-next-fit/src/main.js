require([
  'jquery',
  'common-controls',
  'common-output',
  'common-random',
  'algorithm-shelfnf'
], function (
  $,
  Controls,
  Output,
  RandomIft,
  ShelfNextFit
) {
  var demo1 = new Output('#demo1');

  function onFormChange(controls) {
    demo1.draw(ShelfNextFit.pack(controls));
  };

  new Controls(onFormChange);

  $('[data-toggle="tooltip"]').tooltip();
});
