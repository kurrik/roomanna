/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';

import ComponentBrowser from 'components/ComponentBrowser/ComponentBrowser';
import SectionBase from 'components/ComponentBrowser/SectionBase';
import TestComponent from 'components/TestComponent';
import TimestampChart from 'components/TimestampChart';

import 'components/ComponentBrowser/index.html';

function sections() {
  return [
    <SectionBase title='TestComponent' key='a'>
      <TestComponent />
    </SectionBase>,
    <SectionBase title='TimestampChart' key='b'>
      <TimestampChart data={[{'value': 1380854103662},{'value': 1363641921283}]} />
    </SectionBase>,
  ];
}

ReactDOM.render(
  <ComponentBrowser sections={sections()} />,
  document.getElementById('root')
);
