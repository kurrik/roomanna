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

type Bounds = {
  top: number,
  right: number,
  bottom: number,
  left: number,
}

type ComputedBounds = Bounds & {
  width: number,
  height: number,
  centerX: number,
  centerY: number,
};

export type DataSeries = DataPoint & {
  className?: string,
  points: Array<DataPoint>,
};

type Props = {
  data: Array<DataSeries>,
  chartHeight: number,
  chartWidth: number,
  className?: string,
  padding: Bounds,
  pad: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years',
  xLabelHeight: number,
  xLabel: string,
  xLabelClassName?: string,
  xAxisTickHeight: number,
  xAxisTickFormat: string,
  xAxisTicks: number,
  yLabelWidth: number,
  yLabel: string,
  yLabelClassName?: string,
  yAxisTickWidth: number,
  yAxisTickFormat: string,
  yAxisTicks: number,
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
    padding: {
      top: 15,
      right: 40,
      bottom: 15,
      left: 15,
    },
    pad: 'days',
    xLabelHeight: 0,
    xLabel: '',
    xAxisTicks: 8,
    xAxisTickHeight: 25,
    xAxisTickFormat: '%x',  // e.g. '%m/%d/%y %H:%M'
    yLabelWidth: 0,
    yLabel: '',
    yAxisTicks: 4,
    yAxisTickWidth: 75,
    yAxisTickFormat: '%x',
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

  computeBounds = (bounds: Bounds): ComputedBounds => {
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    return {
      ...bounds,
      width: width,
      height: height,
      centerX: width / 2 + bounds.left,
      centerY: height / 2 + bounds.top,
    };
  };

  renderChart = (dom: Node) => {
    const {
      data,
      chartHeight,
      chartWidth,
      className,
      padding,
      xLabelHeight,
      xLabel,
      xLabelClassName,
      xAxisTicks,
      xAxisTickHeight,
      xAxisTickFormat,
      yLabelWidth,
      yLabel,
      yLabelClassName,
      yAxisTicks,
      yAxisTickWidth,
      yAxisTickFormat,
      xHighlight,
      yHighlight,
      pointRadius,
    } = this.props;

    const innerBounds = this.computeBounds({
      left: padding.left + yLabelWidth + yAxisTickWidth,
      right: chartWidth - padding.right,
      top: padding.top,
      bottom: chartHeight - padding.bottom - xLabelHeight - xAxisTickHeight,
    });

    const xAxisBounds = this.computeBounds({
      left: innerBounds.left,
      right: innerBounds.right,
      top: innerBounds.bottom,
      bottom: innerBounds.bottom + xAxisTickHeight,
    });

    const xLabelBounds = this.computeBounds({
      left: innerBounds.centerX,
      right: innerBounds.centerX,
      top: xAxisBounds.bottom,
      bottom: xAxisBounds.bottom + xLabelHeight,
    });

    const yLabelBounds = this.computeBounds({
      left: padding.left,
      right: padding.left + yLabelWidth,
      top: innerBounds.centerY,
      bottom: innerBounds.centerY,
    });

    const yAxisBounds = this.computeBounds({
      left: yLabelBounds.right,
      right: yLabelBounds.right + yAxisTickWidth,
      top: innerBounds.top,
      bottom: innerBounds.bottom,
    });


    const x = d3.scaleTime().range([0, innerBounds.width]);
    const y = d3.scaleTime().range([0, innerBounds.height]);

    const yExtentPadding = this.timeRangePad(data);
    const xExtentPadding = data
      .map((x) => this.timeRangePad(x.points))
      .reduce(this.reduceTimeRanges);
    x.domain(d3.extent([xExtentPadding.min, xExtentPadding.max]));
    y.domain(d3.extent([yExtentPadding.min, yExtentPadding.max]));

    var xAxis = d3.axisBottom(x)
      .ticks(xAxisTicks)
      .tickSize(-innerBounds.height, 0)
      .tickFormat(d3.timeFormat(xAxisTickFormat));

    var yAxis = d3.axisLeft(y)
      .ticks(yAxisTicks)
      .tickSize(-innerBounds.width, 0)
      .tickFormat(d3.timeFormat(yAxisTickFormat));

    var svg = d3.select(dom).append('svg')
      .attr('class', classnames(styles.chart, className))
      .attr('width', chartWidth)
      .attr('height', chartHeight);

    var innerContext = svg.append('g')
      .attr('transform', `translate(${innerBounds.left},${innerBounds.top})`);

    innerContext.append('g')
      .attr('class', classnames('x', styles.axis))
      .attr('transform', `translate(0, ${innerBounds.height})`)
      .call(xAxis);

    innerContext.append('g')
      .attr('class', classnames('y', styles.axis))
      .call(yAxis);

    if (xLabel) {
      svg.append('g')
        .attr('class', classnames('x', styles.axis, styles.label, xLabelClassName))
        .attr('transform', 'translate(0, 0)')
        .append('text')
        .attr('x', xLabelBounds.centerX)
        .attr('y', xLabelBounds.centerY)
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'text-after-edge')
        .text(xLabel);
    }

    if (yLabel) {
      svg.append('g')
        .attr('class', classnames('y', styles.axis, styles.label, yLabelClassName))
        .attr('transform', 'translate(0, 0)')
        .append('text')
        .attr('x', -yLabelBounds.centerY) // Reversed on purpose
        .attr('y', yLabelBounds.centerX) // Reversed on purpose
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'text-before-edge')
        .text(yLabel);
    }

    if (xHighlight) {
      const highlight = this.computeBounds({
        top: y(moment(xHighlight.min)),
        bottom: y(moment(xHighlight.max)),
        left: 0,
        right: innerBounds.width,
      });
      innerContext
        .append('rect')
        .attr('class', styles.highlight)
        .attr('width', highlight.width)
        .attr('height', highlight.height)
        .attr('x', highlight.left)
        .attr('y', highlight.top);
    }

    if (yHighlight) {
      const highlight = this.computeBounds({
        top: 0,
        bottom: innerBounds.height,
        left: x(moment(yHighlight.min)),
        right: x(moment(yHighlight.max)),
      });
      innerContext
        .append('rect')
        .attr('class', styles.highlight)
        .attr('width', highlight.width)
        .attr('height', highlight.height)
        .attr('x', highlight.left)
        .attr('y', highlight.top);
    }

    var series = innerContext
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
