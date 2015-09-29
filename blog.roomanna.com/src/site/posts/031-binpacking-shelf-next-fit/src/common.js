define(['jquery', 'ICanHaz'], function Common($, ich) {
  function generateWords(count) {
    var i,
        j,
        str = '',
        output = [];
    for (i = 0; i < count; i++) {
      str += 'a';
      output[i] = str;
    }
    return output;
  };

  function renderWords(words, $pool) {
    var i;
    for (i = 0; i < words.length; i++) {
      $pool.append(ich.tmplWord({
        id: 'word' + i.toString(),
        text: words[i]
      }));
    }
  };

  function buildPool($pool) {
    var words;
    words = generateWords(10);
    renderWords(words, $pool);
  };

  function buildControls($controls, $pool, callback) {
    $controls.append(ich.tmplControls({
      widths: [
        { value: 64 },
        { value: 256, selected: true },
        { value: 512 }
      ]
    }));
    $controls.find('.Controls').change(function wrapCallback() {
      callback(getConfig($controls, $pool));
    });
    callback(getConfig($controls, $pool));
  };

  function getWordData($pool) {
    var output = [],
        $word;
    $pool.find('.Word').map(function(i, elem) {
      $word = $(elem);
      output.push({
        width: $word.outerWidth(),
        height: $word.outerHeight(),
        text: $word.text(),
      });
    });
    return output;
  };

  function getConfig($controls, $pool) {
    return {
      words: getWordData($pool),
      width: parseInt($controls.find('.Controls-width').val())
    }
  };

  function init($controls, $pool, callback) {
    buildPool($pool);
    buildControls($controls, $pool, callback);
  };

  return {
    init: init
  };
});
