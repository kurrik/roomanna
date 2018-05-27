/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';

import ComponentBrowser from './ComponentBrowser';
import SectionTimestampChart from './SectionTimestampChart';
import SectionControls from './SectionControls';
import Section from './Section';

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
      </Section>
      <SectionControls />
      <SectionTimestampChart />
    </ComponentBrowser>,
    rootElement
  );
}
