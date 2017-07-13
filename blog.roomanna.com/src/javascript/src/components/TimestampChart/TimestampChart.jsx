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

export type DataSeries = DataPoint & {
  className?: string,
  points: Array<DataPoint>,
};

type Props = {
  data: Array<DataSeries>,
  chartHeight: number,
  chartWidth: number,
  margin: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  pad: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years',
  xLabelFormat: string,
  yLabelFormat: string,
  xHighlight?: TimeRange,
  yHighlight?: TimeRange,
  pointRadius: number,
};

type TimeRange = {
  min: Moment,
  max: Moment,
  className?: string,
};

export default class TimestampChart extends React.Component {
  props: Props;

  static defaultProps = {
    data: [],
    chartHeight: 300,
    chartWidth: window.innerWidth - 150,
    margin: {
      top: 10,
      right: 25,
      bottom: 15,
      left: 35,
    },
    pad: 'days',
    xLabelFormat: '%x',  // e.g. '%m/%d/%y %H:%M'
    yLabelFormat: '%x',
    pointRadius: 5,
  };

  timeRangePad = (points: $ReadOnlyArray<DataPoint>): TimeRange => {
    let min;
    let max;
    let pad = 'days';
    const timestamps = points.map(x => x.value);
    if (timestamps.length > 1) {
      min = moment(Math.min(...timestamps));
      max = moment(Math.max(...timestamps));
      pad = this.getDatePadding(min, max);
      min.subtract(1, pad);
      max.add(1, pad);
    } else {
      min = moment(timestamps[0]).subtract(1, 'hour');
      max = moment(timestamps[0]).add(1, 'hour');
    }
    return {
      min: min,
      max: max,
    };
  };

  reduceTimeRanges = (total: TimeRange, x: TimeRange): TimeRange => {
    if (!total) {
      return x;
    }
    if (x.min < total.min) {
      total.min = x.min;
    }
    if (x.max > total.max) {
      total.max = x.max;
    }
    return total;
  };

  getDatePadding = (min: Moment, max: Moment) => {
    if (max.diff(min, 'years') > 0) {
      return 'months';
    } else if (max.diff(min, 'months') > 0) {
      return 'days';
    } else if (max.diff(min, 'days') > 0) {
      return 'days';
    } else if (max.diff(min, 'hours') > 0) {
      return 'hours';
    } else if (max.diff(min, 'minutes') > 0) {
      return 'minutes';
    } else {
      return 'seconds';
    }
  };

  renderChart = (dom: Node) => {
    const {
      data,
      chartHeight,
      chartWidth,
      margin,
      xLabelFormat,
      yLabelFormat,
      xHighlight,
      yHighlight,
      pointRadius,
    } = this.props;

    const paddingY = this.timeRangePad(data);
    const paddingX = data.map((x) => this.timeRangePad(x.points)).reduce(this.reduceTimeRanges);
    const width = chartWidth;
    const height = chartHeight - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0 + margin.right, width - margin.left]);
    const y = d3.scaleTime().range([margin.top, height - margin.bottom - margin.top]);

    const ticks = width > 800 ? 8 : 4;

    x.domain(d3.extent([paddingX.min, paddingX.max]));
    y.domain(d3.extent([paddingY.min, paddingY.max]));

    d3.select(`.${styles.axis}`)
    var xAxis = d3.axisBottom(x)
      .ticks(ticks)
      .tickSize(-height, 0)
      .tickFormat(d3.timeFormat(xLabelFormat));

    var yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickSize(-width + margin.right, margin.left)
      .tickFormat(d3.timeFormat(yLabelFormat));

    var svg = d3.select(dom).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    var context = svg.append('g')
      .attr('class', styles.context)
      .attr('transform', `translate(${margin.left},${margin.top})`);

    context.append('g')
      .attr('class', classnames('x', 'axis'))
      .attr('transform', `translate(${margin.left},${margin.top + (height - margin.bottom)})`)
      .call(xAxis);

    context.append('g')
      .attr('class', classnames('y', 'axis'))
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(yAxis);

    if (xHighlight) {
      const highlight = {
        top: y(moment(xHighlight.min)) + margin.top,
        bottom: y(moment(xHighlight.max)) + margin.top,
        left: margin.left,
        right: width + margin.left - margin.right,
      };
      context
        .append('rect')
        .attr('class', styles.highlight)
        .attr('width', highlight.right - highlight.left)
        .attr('height', highlight.bottom - highlight.top)
        .attr('x', highlight.left)
        .attr('y', highlight.top);
    }

    if (yHighlight) {
      const highlight = {
        top: -margin.top,
        bottom: height - margin.bottom + margin.top,
        left: x(moment(yHighlight.min)) + margin.left,
        right: x(moment(yHighlight.max)) + margin.left,
      };
      context
        .append('rect')
        .attr('class', styles.highlight)
        .attr('width', highlight.right - highlight.left)
        .attr('height', highlight.bottom - highlight.top)
        .attr('x', highlight.left)
        .attr('y', highlight.top);
    }

    var series = context
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll(`.${styles.series}`)
        .data(data);

    series.exit()
      .remove();

    series.enter()
      .append('g')
      .attr('class', styles.series);

    var points = series.enter().merge(series)
      .selectAll(`.${styles.point}`)
        .data((d) => d.points.map((x) => ({...x, parent: d})));

    const pointClasses = (pt: Object): ?string => {
      return classnames(
        styles.point,
        pt.parent.className,
        this.pointRangeClass(pt, yHighlight),
        this.pointRangeClass(pt.parent, xHighlight),
      );
    };

    points.enter()
      .append('circle')
      .attr('class', (d) => pointClasses(d))
      .attr('cx', (d) => x(moment(d.value)))
      .attr('cy', (d) => y(moment(d.parent.value)))
      .attr('r', pointRadius);

    points.exit()
      .remove();

  };

  pointRangeClass = (point: DataPoint, range: ?TimeRange): ?string => {
    if (range && range.className && point.value.isBetween(range.min, range.max, null, '[]')) {
      return range.className;
    }
    return null;
  };

  render() {
    return (
      <div ref={this.renderChart}></div>
    );
  }
}
