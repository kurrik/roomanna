/* @flow */

import React from 'react';

import Section, {SectionSublabel} from './Section';

export default class SectionStyles extends React.Component<{}> {
  render() {
    return (
      <Section title='Styles'>
        <SectionSublabel>Inline styles</SectionSublabel>
        <p>Testing the <code>code</code> block.</p>
      </Section>
    );
  }
}
