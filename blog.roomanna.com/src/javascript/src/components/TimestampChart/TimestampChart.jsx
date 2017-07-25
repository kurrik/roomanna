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
  xLabel?: string,
  yLabel?: string,
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
      top: 15,
      right: 15,
      bottom: 35,
      left: 75,
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
      xLabel,
      yLabel,
      xLabelFormat,
      yLabelFormat,
      xHighlight,
      yHighlight,
      pointRadius,
    } = this.props;

    const paddingY = this.timeRangePad(data);
    const paddingX = data.map((x) => this.timeRangePad(x.points)).reduce(this.reduceTimeRanges);
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, innerWidth]);
    const y = d3.scaleTime().range([0, innerHeight]);

    const ticks = innerWidth > 800 ? 8 : 4;

    x.domain(d3.extent([paddingX.min, paddingX.max]));
    y.domain(d3.extent([paddingY.min, paddingY.max]));

    var xAxis = d3.axisBottom(x)
      .ticks(ticks)
      .tickSize(-innerHeight, 0)
      .tickFormat(d3.timeFormat(xLabelFormat));

    var yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickSize(-innerWidth, 0)
      .tickFormat(d3.timeFormat(yLabelFormat));

    var svg = d3.select(dom).append('svg')
      .attr('class', classnames(styles.chart))
      .attr('width', chartWidth)
      .attr('height', chartHeight);

    var context = svg.append('g')
      .attr('class', styles.context)
      .attr('transform', `translate(${margin.left},${margin.top})`);

    context.append('g')
      .attr('class', classnames('x', styles.axis))
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    context.append('g')
      .attr('class', classnames('y', styles.axis))
      .call(yAxis);

    let xCoord;
    let yCoord;

    if (xLabel) {
      xCoord = innerWidth / 2;
      yCoord = innerHeight + margin.bottom;
      context.append('g')
        .attr('class', classnames('x', styles.axis, styles.label))
        .append('text')
        .attr('x', xCoord)
        .attr('y', yCoord)
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'text-after-edge')
        .text(xLabel);
    }

    if (yLabel) {
      xCoord = 0 - margin.left;
      yCoord = innerHeight / 2;
      context.append('g')
        .attr('class', classnames('y', styles.axis, styles.label))
        .append('text')
        .attr('x', -yCoord)
        .attr('y', xCoord)
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'text-before-edge')
        .text(yLabel);
    }

    if (xHighlight) {
      const highlight = {
        top: y(moment(xHighlight.min)),
        bottom: y(moment(xHighlight.max)),
        left: 0,
        right: innerWidth,
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
        top: 0,
        bottom: innerHeight,
        left: x(moment(yHighlight.min)),
        right: x(moment(yHighlight.max)),
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
