define(['jquery', 'icanhaz', 'common-random'], function initControls($, ich, RandomIft) {
  function generateWordList(config) {
    var i,
        j,
        wordLength,
        values,
        str = '',
        output = [];
    values = RandomIft(config.seed, config.exponent, config.count);
    for (i = 0; i < config.count; i++) {
      str = '';
      wordLength = Math.max(1, Math.round(config.maxlength * values[i]));
      for (j = 0; j < wordLength; j++) {
        str += 'a';
      }
      output[i] = str;
    }
    return output;
  };

  function renderControls($root, component) {
    var formData = {
      widths: $.map([ 128, 256, 512 ], function (v) {
        return { value: v, selected: component.config.width == v };
      }),
      count: {
        min: 1,
        max: 30,
        step: 1,
        value: component.config.count
      },
      exponent: {
        min: -3.0,
        max: 3.0,
        step: 0.1,
        value: component.config.exponent
      },
      seed: {
        min: 1,
        max: 10,
        step: 1,
        value: component.config.seed
      },
      maxlength: {
        min: 1,
        max: 30,
        step: 1,
        value: component.config.maxlength
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

  function Controls(callback) {
    this.$root = $(document);
    this.config = {
      width: 256,
      count: 5,
      exponent: 0.0,
      seed: 1,
      maxlength: 15
    };
    this.callback = callback;
    renderControls(this.$root, this);
    this.$pool = this.$root.find('.Controls-words');
    this.onChange();
  };

  Controls.prototype.onChange = function onChange() {
    var component = this;
    renderWords(generateWordList(this.config), this.$pool);
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
