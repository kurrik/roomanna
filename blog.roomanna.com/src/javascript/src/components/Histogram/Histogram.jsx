/* @flow */

import React from 'react';
import * as d3 from 'd3';
import classnames from 'classnames';
import moment from 'moment';
import type Moment from 'moment';
import type {Theme} from 'components/types';

import styles from './Histogram.css';

export type DataBucket = {
  label: string,
  value: number,
};

type Bounds = {
  top: number,
  right: number,
  bottom: number,
  left: number,
};

type ComputedBounds = Bounds & {
  width: number,
  height: number,
  centerX: number,
  centerY: number,
};

type Props = {
  data: Array<DataBucket>,
  chartHeight: number,
  chartWidth: number,
  className?: string,
  padding: Bounds,
  theme?: Theme,
  xLabelHeight: number,
  xLabel: string,
  xLabelClassName?: string,
  xAxisTickHeight: number,
  yLabelWidth: number,
  yLabel: string,
  yLabelClassName?: string,
  yAxisTickWidth: number,
};

type ReactObjRef = {
  current: null | React$ElementRef<'div'>
};

export default class Histogram extends React.Component<Props> {
  graphRoot: ReactObjRef;

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
    theme: 'blue',
    xLabelHeight: 0,
    xLabel: '',
    xAxisTickHeight: 25,
    yLabelWidth: 0,
    yLabel: '',
    yAxisTickWidth: 75,
  };

  constructor(props: Props) {
    super(props);
    this.graphRoot = React.createRef();
  }

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

  renderChart = (dom: ?Node) => {
    console.log('render');
    if (!dom) {
      return;
    }

    const {
      data,
      chartHeight,
      chartWidth,
      className,
      padding,
      xLabelHeight,
      xLabel,
      xLabelClassName,
      xAxisTickHeight,
      yLabelWidth,
      yLabel,
      yLabelClassName,
      yAxisTickWidth,
    } = this.props;

    console.log('DATA', data);
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

    const x = d3.scaleBand().rangeRound([0, innerBounds.width]).padding(0.1);
    const y = d3.scaleLinear().range([innerBounds.height, 0]);

    const values = data.map(x => x.value);
    const labels = data.map(x => x.label);

    x.domain(labels);
    y.domain(d3.extent([...values, 0]));

    var xAxis = d3.axisBottom(x)
      .tickSize(-innerBounds.height, 0);

    var yAxis = d3.axisLeft(y)
      .tickSize(-innerBounds.width, 0);

    var svg = d3.select(dom).append('svg')
      .attr('class', classnames(styles.chart, className))
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`);

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
      const xLabelText = svg.append('g')
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

    var series = innerContext
      .append('g')
      .selectAll(`.${styles.series}`)
        .data([data]);

    series.exit()
      .remove();

    series.enter()
      .append('g')
      .attr('class', styles.series);

    var bars = series.enter().merge(series)
      .selectAll(`.${styles.bar}`)
        .data((d) => d);

    bars
      .enter()
        .append('rect')
        .attr('class', (d) => classnames(styles.bar))
      .merge(bars)
        .attr('x', (d) => x(d.label))
        .attr('y', (d) => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d) => innerBounds.height - y(d.value));

    bars.exit()
      .remove();

  };

  shouldComponentUpdate(nextProps: Props) {
    console.log('Should update?');
    return true;
  }

  componentDidMount() {
    this.renderChart(this.graphRoot.current);
  }

  render() {
    const {theme} = this.props;
    const className = classnames(styles.histogram, styles[theme]);
    return (
      <div ref={this.graphRoot} className={className}></div>
    );
  }
}
