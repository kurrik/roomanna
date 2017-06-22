/* @flow */

import React from 'react';
import moment from 'moment';

import Section from './Section';
import TimestampChart from 'components/TimestampChart';

export default class SectionTimestampChart extends React.Component {
  getData = () => {
    const base = moment();
    const fromNow = (obj) => base.clone().add(obj);
    return [
      {
        value: fromNow({days: 1}),
        points: [
          {value: fromNow({days: 1, minutes: 30})},
          {value: fromNow({days: 1, minutes: 40})},
        ],
      },
      {
        value: fromNow({days: 2}),
        points: [
          {value: fromNow({days: 2, minutes: 10})},
          {value: fromNow({days: 2, minutes: 25})},
          {value: fromNow({days: 2, minutes: 90})},
        ],
      },
    ];
  }

  render() {
    return (
      <Section title='TimestampChart'>
        <TimestampChart data={this.getData()} />
      </Section>
    );
  }
}
