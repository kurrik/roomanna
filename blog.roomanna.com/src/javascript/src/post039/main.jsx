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

    const tweetCountGenerator = d3.randomNormal(10, 10.0);
    const tweetMinuteSpacingGenerator = d3.randomNormal(240, 200);
    const impressionCountGenerator = d3.randomNormal(100, 10.0);
    const impressionSecondSpacingGenerator = d3.randomExponential(1/2000);
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
      let impressionTime: Moment = tweetTime.clone();
      for (let j = 0; j < impressionCount; j++) {
        impressionTime.add({
          seconds: impressionSecondSpacingGenerator(),
        });
        this.data[i].points.push({
          value: impressionTime.clone(),
        });
      }
    }
  }
}

const example = new DataGenerator(moment('2017-06-01'), 'hi!');
const range = { min: moment('2017-06-03'), max: moment('2017-06-04'), className: styles.highlight };

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
  <TimestampChart yHighlight={range} {...chartProps} />,
  document.getElementById('example01')
);

ReactDOM.render(
  <TimestampChart xHighlight={range} {...chartProps} />,
  document.getElementById('example02')
);

ReactDOM.render(
  <TimestampChart xHighlight={range} yHighlight={range} {...chartProps} />,
  document.getElementById('example03')
);
