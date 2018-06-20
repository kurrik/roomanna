/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';

import ComponentBrowser from './ComponentBrowser';
import Section from './Section';
import SectionControls from './SectionControls';
import SectionHistogram from './SectionHistogram';
import SectionStyles from './SectionStyles';
import SectionTimestampChart from './SectionTimestampChart';

import Alphabet from 'components/Alphabet';
import TestComponent from 'components/TestComponent';

import 'components/ComponentBrowser/index.html';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.render(
    <ComponentBrowser>
      <Section title='TestComponent'>
        <TestComponent />
      </Section>
      <Section title='Alphabet'>
        <Alphabet />
        <Alphabet theme='blue' />
        <Alphabet theme='red' />
        <Alphabet theme='yellow' />
        <Alphabet theme='green' />
        <Alphabet theme='purple' />
      </Section>
      <SectionStyles />
      <SectionControls />
      <SectionHistogram />
      <SectionTimestampChart />
    </ComponentBrowser>,
    rootElement
  );
}
