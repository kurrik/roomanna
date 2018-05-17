/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';

import ComponentBrowser from './ComponentBrowser';
import SectionTimestampChart from './SectionTimestampChart';
import Section from './Section';

import Alphabet from 'components/Alphabet';
import TestComponent from 'components/TestComponent';

import 'components/ComponentBrowser/index.html';

ReactDOM.render(
  <ComponentBrowser>
    <Section title='TestComponent'>
      <TestComponent />
    </Section>
    <Section title='Alphabet'>
      <Alphabet />
    </Section>
    <SectionTimestampChart />
  </ComponentBrowser>,
  document.getElementById('root')
);
