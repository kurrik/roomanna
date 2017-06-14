import React from 'react';
import ReactDOM from 'react-dom';
import TestComponent from 'components/TestComponent';

ReactDOM.render(
  <TestComponent />,
  document.querySelector('.postbody')
);

import './main.css';
import 'seedrandom';
import * as d3 from 'd3';

Math.seedrandom('hello.');
console.log('foo', d3);
console.log(d3.randomExponential(1/40)());

const tweetCountGenerator = d3.randomNormal(20, 10.0);
const tweetTimestampGenerator = d3.randomNormal(3600000, 1800000);
const impressionCountGenerator = d3.randomNormal(100, 10.0);
const impressionTimestampGenerator = d3.randomExponential(1/1000);

let points = [];
let start = new Date("6/1/2017").getTime();

const tweetCount = Math.round(tweetCountGenerator());
for (let i = 0; i < tweetCount; i++) {
  const impressionCount = Math.round(impressionCountGenerator());
  start = start + tweetTimestampGenerator();
  points.push([]);
  let tweetStart = start;
  for (let j = 0; j < impressionCount; j++) {
    const timestamp = tweetStart + impressionTimestampGenerator();
    points[i].push(new Date(timestamp));
  }
}

console.log('points', points);
