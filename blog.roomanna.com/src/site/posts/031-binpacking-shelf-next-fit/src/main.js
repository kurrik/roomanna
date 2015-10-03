require([
  'jquery',
  'common-controls',
  'common-output',
  'algorithm-shelfnf'
], function (
  $,
  Controls,
  Output,
  ShelfNextFit
) {
  var demo1 = new Output('#demo1');

  function onFormChange(controls) {
    demo1.draw(ShelfNextFit.pack(controls));
  };

  new Controls('#controls', onFormChange);
});
