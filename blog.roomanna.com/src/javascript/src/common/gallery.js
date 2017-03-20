import PhotoSwipe from 'photoswipe/dist/photoswipe.js';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default.js';
import 'style-loader!css-loader!photoswipe/dist/photoswipe.css';
import 'style-loader!css-loader!photoswipe/dist/default-skin/default-skin.css';

import styles from './gallery.css';

export default class Gallery {
  constructor(selector) {
    const domGalleries = document.querySelectorAll(selector);
    Array.from(domGalleries).forEach((dom, i) => {
      dom.setAttribute('data-pswp-uid', i+1);
      dom.addEventListener('click', this.onThumbnailsClick.bind(this));
      dom.classList.add(styles.gallery);
    });
    var hashData = this.photoswipeParseHash();
    if(hashData.has('pid') && hashData.has('gid')) {
      const pid = hashData.get('pid');
      const gid = domGalleries[hashData.get('gid') - 1];
      const disableAnimation = true;
      const fromURL = true;
      this.openPhotoSwipe(pid, gid, disableAnimation, fromURL);
    }
  }

  itemsFromDOM(element) {
    return Array.from(element.childNodes)
      .filter(x => x.nodeType === 1)
      .map(domFigure => {
        const domAnchor = domFigure.querySelector('a');
        const dimensions = domAnchor.getAttribute('data-size')
          .split('x')
          .map(s => parseInt(s, 10));
        const item = {
          el: domFigure,
          src: domAnchor.getAttribute('href'),
          w: dimensions[0],
          h: dimensions[1]
        };
        Array.from(domFigure.querySelector('figcaption[itemprop~=description]') || [])
          .forEach(dom => item.title = dom.textContent);
        Array.from(domAnchor.querySelector('img'))
          .forEach(dom => item.msrc = dom.getAttribute('src'));
        return item;
      });
  }

  closestParent(element, fn) {
    let curr = element;
    while (element) {
      if (fn(element)) return element;
      element = element.parentNode;
    }
    return null;
  }

  openPhotoSwipe(index, domGallery, disableAnimation, fromURL) {
    const domPswp = document.querySelector('.pswp');
    const items = this.itemsFromDOM(domGallery);
    let options = {
      galleryUID: domGallery.getAttribute('data-pswp-uid'),
      getThumbBoundsFn: (i) => {
        const thumbnail = items[i].el.querySelector('img');
        const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
        const rect = thumbnail.getBoundingClientRect();
        return {
          x:rect.left,
          y:rect.top + pageYScroll,
          w:rect.width
        };
      }
    };
    if (fromURL) {
      if(options.galleryPIDs) {
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        options.index = items.findIndex(x => x.pid === index);
      } else {
        // Url indices start from 1.
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }
    // exit if index not found
    if (isNaN(options.index) || options.index === -1) {
      return;
    }
    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }
    const gallery = new PhotoSwipe(domPswp, PhotoSwipeUI_Default, items, options);
    gallery.init();
  }

  onThumbnailsClick(evt) {
    if (evt.target.getAttribute("target") === "_blank") {
      return;
    }
    evt.preventDefault();
    const findFigure = e => e.tagName && e.tagName.toUpperCase() === 'FIGURE';
    const clickedListItem = this.closestParent(evt.target, findFigure);
    if (!clickedListItem) {
      return;
    }
    const index = Array.from(clickedListItem.parentNode.childNodes)
      .filter(x => x.nodeType === 1)
      .findIndex(node => node === clickedListItem);
    if(index >= 0) {
      this.openPhotoSwipe(index, clickedListItem.parentNode);
    }
    return false;
  }

  photoswipeParseHash() {
    const hash = window.location.hash.substring(1);
    const params = new Map(hash.split('&').map(pairs => pairs.split('=')));
    if(params.gid) {
      params.gid = parseInt(params.gid, 10);
    }
    return params;
  }
}
