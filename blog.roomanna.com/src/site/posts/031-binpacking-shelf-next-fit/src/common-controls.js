define(['jquery', 'icanhaz'], function initControls($, ich) {
  function generateWordList(count) {
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

  function renderControls($root) {
    $root.append(ich.tmplControls({
      widths: [
        { value: 128 },
        { value: 256, selected: true },
        { value: 512 }
      ],
      count: {
        min: 1,
        max: 20,
        step: 1,
        value: 5
      }
    }));
  }

  function renderWords(wordList, $pool) {
    var i;
    $pool.empty();
    for (i = 0; i < wordList.length; i++) {
      $pool.append(ich.tmplWord({
        id: 'word' + i.toString(),
        text: wordList[i]
      }));
    }
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

  function getControlsConfig($root) {
    return {
      width: parseInt($root.find('.Controls-width').val()),
      count: parseInt($root.find('.Controls-count').val())
    };
  };

  function Controls(root, callback) {
    this.$root = $(root);
    this.callback = callback;
    renderControls(this.$root);
    this.$pool = this.$root.find('.Controls-words');
    this.$root.find('.Controls-form').on('input', this.onChange.bind(this));
    this.onChange();
  };

  Controls.prototype.onChange = function onChange() {
    this.config = getControlsConfig(this.$root);
    renderWords(generateWordList(this.config.count), this.$pool);
    this.words = getWordData(this.$root);
    this.$root.find('.Controls-count--label').text(this.config.count);
    this.callback(this);
  };

  Controls.prototype.getWords = function getWords() {
    return this.words;
  };

  return Controls;
});
