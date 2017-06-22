/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';

import ComponentBrowser from './ComponentBrowser';
import SectionTimestampChart from './SectionTimestampChart';
import Section from './Section';
import TestComponent from 'components/TestComponent';

import 'components/ComponentBrowser/index.html';

ReactDOM.render(
  <ComponentBrowser>
    <Section title='TestComponent'>
      <TestComponent />
    </Section>
    <SectionTimestampChart />
  </ComponentBrowser>,
  document.getElementById('root')
);
