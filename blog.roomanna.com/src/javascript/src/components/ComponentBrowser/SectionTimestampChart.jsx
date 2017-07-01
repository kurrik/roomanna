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
        class: styles.seriesA,
        value: this.fromNow({hours: 1}),
        points: [
          {value: this.fromNow({hours: 1, minutes: 30})},
          {value: this.fromNow({hours: 1, minutes: 40})},
        ],
      },
      {
        class: styles.seriesB,
        value: this.fromNow({hours: 2}),
        points: [
          {value: this.fromNow({hours: 2, minutes: 10})},
          {value: this.fromNow({hours: 2, minutes: 25})},
          {value: this.fromNow({hours: 2, minutes: 90})},
        ],
      },
      {
        class: styles.seriesC,
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
  };

  render() {
    return (
      <Section title='TimestampChart'>
        <SectionSublabel>Normal chart</SectionSublabel>
        <TimestampChart data={this.getData()} x />
        <SectionSublabel>Highlights</SectionSublabel>
        <TimestampChart data={this.getData()} xHighlight={this.middleRange} yHighlight={this.middleRange} />
      </Section>
    );
  }
}
