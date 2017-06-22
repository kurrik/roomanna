/* @flow */

import React from 'react';

import Section from './Section';
import TimestampChart from 'components/TimestampChart';

export default class SectionTimestampChart extends React.Component {
  render() {
    return (
      <Section title='TimestampChart'>
        <TimestampChart data={[{'value': 1380854103662},{'value': 1363641921283}]} />
      </Section>
    );
  }
}
