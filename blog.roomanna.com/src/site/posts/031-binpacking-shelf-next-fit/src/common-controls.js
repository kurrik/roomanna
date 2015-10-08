define(['jquery', 'icanhaz', 'common-random'], function initControls($, ich, RandomIft) {
  var maxWordCount = 30,
      baseSize = 12;

  function renderControls($root, component) {
    var formData = {
      widths: $.map([ 128, 256, 512 ], function (v) {
        return { value: v, selected: component.config.width == v };
      }),
      seed: {
        min: 1,
        max: 10,
        step: 1,
        value: component.config.seed
      },
      wordCount: {
        min: 1,
        max: maxWordCount,
        step: 1,
        value: component.config.wordCount
      },
      wordExponent: {
        min: -3.0,
        max: 3.0,
        step: 0.1,
        value: component.config.wordExponent
      },
      wordMaxLength: {
        min: 1,
        max: 30,
        step: 1,
        value: component.config.wordMaxLength
      },
      sizeExponent: {
        min: -3.0,
        max: 3.0,
        step: 0.1,
        value: component.config.sizeExponent
      },
      sizeVariance: {
        min: 0,
        max: 5,
        step: 1,
        value: component.config.sizeVariance
      }
    };
    $root.find('[data-template]').each(function(i, node) {
      var $node = $(node),
          templateName = $node.attr('data-template');
      $node.html(ich[templateName](formData));
    });
    $root.find('[data-binding]').each(function(i, node) {
      var $node = $(node);
      $node.on('input', function (evt) {
        var newValue = parseFloat($(evt.target).val()),
            binding = $(evt.target).attr('data-binding');
        if (newValue != component.config[binding]) {
          component.config[binding] = newValue;
          $root.find('[data-binding=' + binding +']').val(newValue);
          component.onChange();
        }
      });
    });
  };

  function renderWords(config, $pool) {
    var i,
        j,
        str,
        wordLength,
        wordRandom,
        sizeRandom,
        wordList = [];
    wordRandom = RandomIft(config.seed, config.wordExponent, config.wordCount);
    sizeRandom = RandomIft(config.seed, config.sizeExponent, config.wordCount);
    $pool.empty();
    for (i = 0; i < config.wordCount; i++) {
      str = '';
      wordLength = Math.max(1, Math.round(config.wordMaxLength * wordRandom[i]));
      for (j = 0; j < wordLength; j++) {
        str += 'a';
      }
      $pool.append(ich.tmplWord({
        id:   'word' + i.toString(),
        size: Math.round(baseSize + sizeRandom[i] * config.sizeVariance),
        text: str
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
        size: $word.attr('data-size')
      });
    });
    return output;
  };

  function Controls(callback) {
    this.$root = $(document);
    this.config = {
      width: 256,
      seed: 1,
      wordCount: 5,
      wordExponent: 0.0,
      wordMaxLength: 15,
      sizeExponent: 0.0,
      sizeVariance: 2
    };
    this.callback = callback;
    renderControls(this.$root, this);
    this.$pool = this.$root.find('.Controls-words');
    this.onChange();
  };

  Controls.prototype.onChange = function onChange() {
    var component = this;
    renderWords(this.config, this.$pool);
    this.words = getWordData(this.$pool);
    this.$root.find('[data-binding-label]').each(function (i, node) {
      var $node = $(node),
          binding = $node.attr('data-binding-label');
      $node.text(component.config[binding]);
    });
    this.callback(this);
  };

  Controls.prototype.getWords = function getWords() {
    return this.words;
  };

  return Controls;
});
