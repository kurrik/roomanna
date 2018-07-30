import AnimatedImage from './animated';
import $ from 'jquery';
import 'popper.js';
import 'bootstrap';

$(function () {
  $('.tooltip-trigger').tooltip();
  $('[data-toggle="tooltip"]').tooltip()
});
AnimatedImage.init();
