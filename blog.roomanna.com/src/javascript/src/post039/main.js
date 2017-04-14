import './main.css';
import 'seedrandom';
import * as d3 from 'd3';

Math.seedrandom('hello.');
console.log('foo', d3);
console.log(d3.randomExponential(1/40)());

const tweetCountGenerator = d3.randomNormal(20, 10.0);
const impressionCountGenerator = d3.randomNormal(100, 10.0);
const impressionTimestampGenerator = d3.randomExponential(1/40);

let points = [];
const tweetCount = Math.round(tweetCountGenerator());
for (let i = 0; i < tweetCount; i++) {
  const impressionCount = Math.round(impressionCountGenerator());
  points.push([]);
  for (let j = 0; j < impressionCount; j++) {
    const timestamp = impressionTimestampGenerator();
    points[i].push(timestamp);
  }
}

console.log('points', points);
