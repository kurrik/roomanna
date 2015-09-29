require([
  'jquery',
  'common',
  'shelf-next-fit',
  'ICanHaz'
], function (
  $,
  common,
  ShelfNextFit,
  ich
) {
  var $pool = $('#pool'),
      $controls = $('#controls'),
      $demo1 = $('#demo1'),
      config,
      packed;

  function onFormChange(config) {
    packed = ShelfNextFit.pack(config);
    $demo1.html(ich.tmplOutput(packed));
    console.log('SHELF-NF', packed);
  };

  common.init($controls, $pool, onFormChange);
});
