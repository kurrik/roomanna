/* @flow */

import React from 'react';
import moment from 'moment';

import Section, {SectionSublabel} from './Section';
import TimestampChart from 'components/TimestampChart';
import styles from './SectionTimestampChart.css';

export default class SectionTimestampChart extends React.Component {
  baseTime = moment();

  fromNow = (obj: Object) => this.baseTime.clone().add(obj);

  getData = () => {
    return [
      {
        className: styles.seriesA,
        value: this.fromNow({hours: 1}),
        points: [
          {value: this.fromNow({hours: 1, minutes: 30})},
          {value: this.fromNow({hours: 1, minutes: 40})},
        ],
      },
      {
        className: styles.seriesB,
        value: this.fromNow({hours: 2}),
        points: [
          {value: this.fromNow({hours: 2, minutes: 0})},
          {value: this.fromNow({hours: 2, minutes: 10})},
          {value: this.fromNow({hours: 2, minutes: 25})},
          {value: this.fromNow({hours: 2, minutes: 60})},
          {value: this.fromNow({hours: 2, minutes: 90})},
        ],
      },
      {
        className: styles.seriesC,
        value: this.fromNow({hours: 3}),
        points: [
          {value: this.fromNow({hours: 3, minutes: 13})},
          {value: this.fromNow({hours: 3, minutes: 19})},
          {value: this.fromNow({hours: 3, minutes: 25})},
          {value: this.fromNow({hours: 3, minutes: 45})},
        ],
      },
    ];
  }

  middleRange = {
    min: this.fromNow({hours: 2}),
    max: this.fromNow({hours: 3}),
    pointClassName: styles.highlight,
  };

  render() {
    return (
      <Section title='TimestampChart'>
        <SectionSublabel>Normal chart</SectionSublabel>
        <TimestampChart className={styles.chart} data={this.getData()} yLabel="Y Axis Label" yLabelWidth={15} yAxisTicks={3} xLabel="X Axis Label" xLabelHeight={15} />
        <SectionSublabel>Highlights</SectionSublabel>
        <TimestampChart className={styles.chart} data={this.getData()} yAxisTicks={3} xHighlight={this.middleRange} yHighlight={this.middleRange} />
      </Section>
    );
  }
}
