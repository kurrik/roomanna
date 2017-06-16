/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';

import ComponentBrowser from 'components/ComponentBrowser/ComponentBrowser';
import SectionBase from 'components/ComponentBrowser/SectionBase';
import TestComponent from 'components/TestComponent';

import 'components/ComponentBrowser/index.html';

function sections() {
  return [
    <SectionBase title='Test Component' key='a'>
      <TestComponent />
    </SectionBase>,
  ];
}

ReactDOM.render(
  <ComponentBrowser sections={sections()} />,
  document.getElementById('root')
);
