/* @flow */

/*
 * Based off of https://github.com/mlvl/timeseries/blob/master/timeseries.js
 */

import React from 'react';
import * as d3 from 'd3';
import classnames from 'classnames';
import moment from 'moment';
import type Moment from 'moment';

import styles from './TimestampChart.css';

type DataPoint = {
  value: Moment,
};

type DataSeries = DataPoint & {
  points?: Array<DataPoint>,
};

type Props = {
  data: Array<DataSeries>,
  marginTop: number,
  marginRight: number,
  marginBottom: number,
  marginLeft: number,
};

export default class TimestampChart extends React.Component {
  props: Props;

  static defaultProps = {
    data: [],
    marginTop: 10,
    marginRight: 25,
    marginBottom: 15,
    marginLeft: 35,
  };

  static LessThanDayValues = ['hours', 'minutes', 'seconds'];

  lessThanDay = (value: string) => TimestampChart.LessThanDayValues.includes(value);

  getDate = (timestamp: number) => {
    const date = moment(timestamp);
    date.hour(1);
    date.minute(0);
    date.second(0);
    return date.valueOf();
  }

  getTime = (timestamp: number) => {
    const date = moment(timestamp);
    date.date(1);
    date.month(0);
    date.year(2012);
    return date.valueOf();
  }

  timeRangePad = (points: $ReadOnlyArray<DataPoint>) => {
    let minDate;
    let maxDate;
    let pad = 'days';
    const timestamps = points.map(x => x.value);
    if (timestamps.length > 1) {
      minDate = moment(Math.min(...timestamps));
      maxDate = moment(Math.max(...timestamps));
      pad = this.getDatePadding(minDate, maxDate);
      minDate.subtract(1, pad);
      maxDate.add(1, pad);
    } else {
      minDate = moment(timestamps[0]).subtract(1, 'hour');
      maxDate = moment(timestamps[0]).add(1, 'hour');
    }
    return {
      'minDate': minDate,
      'maxDate': maxDate,
      'pad': pad,
    };
  };

  getDatePadding = (minDate: Moment, maxDate: Moment) => {
    if (maxDate.diff(minDate, 'years') > 0) {
      return 'months';
    } else if (maxDate.diff(minDate, 'months') > 0) {
      return 'days';
    } else if (maxDate.diff(minDate, 'days') > 0) {
      return 'days';
    } else if (maxDate.diff(minDate, 'hours') > 0) {
      return 'hours';
    } else if (maxDate.diff(minDate, 'minutes') > 0) {
      return 'minutes';
    } else {
      return 'seconds';
    }
  };

  renderChart = (dom: Node) => {
    const {data, marginLeft, marginRight, marginTop, marginBottom} = this.props;
    const padding = this.timeRangePad(data);
    if (data.length > 0 && data[0].points) {
      const paddingY = this.timeRangePad(data[0].points);
    }
    const width = window.innerWidth - 150;
    const height = this.lessThanDay(padding.pad) ?
      (100 - marginTop - marginBottom) :
      (300 - marginTop - marginBottom);

    const x = d3.scaleTime().range([0 + marginRight, width - marginLeft]);
    const y = d3.scaleTime().range([marginTop, height - marginBottom - marginTop]);

    const ticks = width > 800 ? 8 : 4;

    x.domain(d3.extent([padding.minDate, padding.maxDate]));

    let xFormat;
    let yFormat;

    if (this.lessThanDay(padding.pad)) {
      xFormat = '%H:%M';
      yFormat = '%m/%d/%y';
      y.domain(d3.extent([padding.minDate]));
    } else {
      xFormat = '%m/%d/%y';
      yFormat = '%H:%M';
      var start = new Date(2012, 0, 1, 0, 0, 0, 0).getTime();
      var stop = new Date(2012, 0, 1, 23, 59, 59, 59).getTime();
      y.domain(d3.extent([start, stop]));
    }

    d3.select(`.${styles.axis}`)
    var xAxis = d3.axisBottom(x)
      .ticks(ticks)
      .tickSize(-height, 0)
      .tickFormat(d3.timeFormat(xFormat));

    var yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickSize(-width + marginRight, marginLeft)
      .tickFormat(d3.timeFormat(yFormat));

    var svg = d3.select(dom).append('svg')
      .attr('width', width + marginLeft + marginRight)
      .attr('height', height + marginTop + marginBottom);

    var context = svg.append('g')
      .attr('class', styles.context)
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    context.append('g')
      .attr('class', classnames('x', 'axis'))
      .attr('transform', `translate(${marginLeft},${marginTop + (height - marginBottom)})`)
      .call(xAxis);

    context.append('g')
      .attr('class', classnames('y', 'axis'))
      .attr('transform', `translate(${marginLeft},${marginTop})`)
      .call(yAxis);

    var circles = context.append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    circles.selectAll('.circ')
      .data(data)
      .enter().append('circle')
      .attr('class', styles.circ)
      .attr('cx', (d) => this.lessThanDay(padding.pad) ? x(d.value) : x(this.getDate(d.value)))
      .attr('cy', (d, i) => this.lessThanDay(padding.pad) ? y(this.getDate(d.value)) : y(this.getTime(d.value)))
      .attr('r', 9)
      .on('click', (d) => console.log(new Date(d.value)));
  };

  render() {
    return (
      <div ref={this.renderChart}></div>
    );
  }
}
