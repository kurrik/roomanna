import $ from 'jquery';

import styles from './animated.css';

export default class AnimatedImage {
  static init() {
    function imgInit() {
      var img = $(this),
          icon = $('<div class="animating-icon">&#x25b6;</div>'),
          wrap = $('<div class="animating-wrap"></div>');
      img.attr('data-poster', img.attr('src'));
      wrap.width(img.width());
      img.wrap(wrap);
      img.after(icon);
    };

    function pauseItem() {
      var wrap = $(this),
          img = wrap.find('img');
      img.attr('src', img.attr('data-poster'));
      wrap.find('.animating-icon').show();
      wrap.removeClass('playing');
    };

    function playItem() {
      var wrap = $(this),
          img = wrap.find('img');
      img.attr('src', img.attr('data-animated'));
      wrap.find('.animating-icon').hide();
      wrap.addClass('playing');
    };

    function toggleItem() {
      var wrap = $(this),
          isPlaying = wrap.hasClass('playing');
      $('.animating-wrap.playing').each(pauseItem);
      if (!isPlaying) {
        playItem.apply(this);
      }
    };

    $('[data-animated]').map(imgInit);
    $('.animating-wrap')
      .click(toggleItem)
      .mouseenter(playItem)
      .mouseleave(pauseItem);
  }
}
