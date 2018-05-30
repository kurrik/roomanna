/* @flow */

import React from 'react';

import Section, {SectionSublabel} from './Section';
import Histogram from 'components/Histogram';

type LabelData = {
  label: string,
  value: number,
};

export default class SectionHistogram extends React.Component<{}> {
  getData(): Array<LabelData> {
    return Array
      .from('abcdefghijklmnopqrstuvwxyz')
      .map((c) => ({
        label: c.toUpperCase(),
        value: Math.round(Math.random() * 100),
      }));
  }

  render() {
    return (
      <Section title='Histogram'>
        <Histogram data={this.getData()} yLabel="Y Axis Label" yLabelWidth={15} xLabel="X Axis Label" xLabelHeight={15} />
      </Section>
    );
  }
}
