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

  function renderControls($root, component) {
    var formData = {
      widths: $.map([ 128, 256, 512 ], function (v) {
        return { value: v, selected: component.config.width == v };
      }),
      count: {
        min: 1,
        max: 20,
        step: 1,
        value: component.config.count
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
        var newValue = parseInt($(evt.target).val()),
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
      count: 5
    };
    this.callback = callback;
    renderControls(this.$root, this);
    this.$pool = this.$root.find('.Controls-words');
    this.onChange();
  };

  Controls.prototype.onChange = function onChange() {
    var component = this;
    renderWords(generateWordList(this.config.count), this.$pool);
    this.words = getWordData(this.$pool);
    this.$root.find('[data-binding-label]').each(function (i, node) {
      var $node = $(node),
          binding = $node.attr('data-binding-label');
      $node.text(component.config[binding]);
    });
    this.$root.find('.Controls-count--label').text(this.config.count);
    this.callback(this);
  };

  Controls.prototype.getWords = function getWords() {
    return this.words;
  };

  return Controls;
});
