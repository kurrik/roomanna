/* @flow */

import React from 'react';

import Section, {SectionSublabel} from './Section';
import Histogram from 'components/Histogram';

type LabelData = {
  label: string,
  value: number,
};

type State = {
  counter: number,
};

export default class SectionHistogram extends React.Component<{}, State> {
  constructor() {
    super();
    this.state = {
      counter: 0,
    };
  }

  getData(): Array<LabelData> {
    return Array
      .from('abcdefghijklmnopqrstuvwxyz')
      .map((c) => ({
        label: c.toUpperCase(),
        value: Math.round(Math.random() * 100),
      }));
  }

  refresh = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  }

  render() {
    return (
      <Section title='Histogram'>
        <Histogram data={this.getData()} yLabel='Y Axis Label' yLabelWidth={15} xLabel='X Axis Label' xLabelHeight={15} />
        <Histogram theme='red' data={this.getData()} yLabel='Y Axis Label' yLabelWidth={15} xLabel='X Axis Label' xLabelHeight={15} />
        <button onClick={this.refresh}>Refresh</button>
      </Section>
    );
  }
}
