import AnimatedImage from './animated';
import $ from 'jquery';
import 'popper.js';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './main.global.css';

$('.tooltip-trigger').tooltip();
$('[data-toggle="tooltip"]').tooltip()
AnimatedImage.init();
