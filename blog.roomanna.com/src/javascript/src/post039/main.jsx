/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import TimestampChart from 'components/TimestampChart';
import type {DataSeries} from 'components/TimestampChart';

import styles from './main.css';

import seedrandom from 'seedrandom';
import * as d3 from 'd3';
import moment from 'moment';
import type Moment from 'moment';

class DataGenerator {
  base: Moment;
  data: Array<DataSeries>;

  fromBase = (obj: Object) => this.base.clone().add(obj);

  constructor(base: Moment, seed: string) {
    this.base = base;
    seedrandom(seed, { global: true });

    const tweetCountGenerator = d3.randomNormal(10, 5.0);
    const tweetMinuteSpacingGenerator = d3.randomNormal(4000, 3000);
    const impressionCountGenerator = d3.randomNormal(20, 8.0);
    const impressionTimeGenerator = d3.randomExponential(1/300000);
    const tweetCount = Math.round(tweetCountGenerator());

    this.data = [];
    let tweetTime: Moment = this.base.clone();
    for (let i = 0; i < tweetCount; i++) {
      const impressionCount = Math.round(impressionCountGenerator());
      tweetTime.add({minutes: tweetMinuteSpacingGenerator()});
      const series: DataSeries = {
        className: styles.point,
        value: tweetTime.clone(),
        points: [],
      };
      this.data.push(series);
      for (let j = 0; j < impressionCount; j++) {
        let impressionTime: Moment = tweetTime.clone();
        impressionTime.add({
          seconds: impressionTimeGenerator(),
        });
        this.data[i].points.push({
          value: impressionTime,
        });
      }
    }
  }
}

const example = new DataGenerator(moment('2017-06-15'), 'hi!');
const rangeMin = moment('2017-07-01');
const rangeMax = moment('2017-08-01');

const rangeX = {
  min: rangeMin,
  max: rangeMax,
  rectClassName: styles.highlightRect,
  pointClassName: styles.highlightPointX
};
const rangeY = {
  min: rangeMin,
  max: rangeMax,
  rectClassName: styles.highlightRect,
  pointClassName: styles.highlightPointY
};

const chartProps = {
  data: example.data,
  chartWidth: 600,
  xAxisTicks: 4,
  xLabel: 'Impression time',
  xLabelHeight: 15,
  yLabel: 'Tweet creation time',
  yLabelWidth: 15,
};

ReactDOM.render(
  <TimestampChart {...chartProps} />,
  document.getElementById('example00')
);

ReactDOM.render(
  <TimestampChart yHighlight={rangeY} {...chartProps} />,
  document.getElementById('example01')
);

ReactDOM.render(
  <TimestampChart xHighlight={rangeX} {...chartProps} />,
  document.getElementById('example02')
);

ReactDOM.render(
  <TimestampChart xHighlight={rangeX} yHighlight={rangeY} {...chartProps} />,
  document.getElementById('example03')
);
