import React from 'react';
import ReactDOM from 'react-dom';

import TestComponent from 'components/TestComponent';

class Browser extends React.Component {
  render() {
    return (
      <div>
        <h1>Component Browser</h1>
        <h2>TestComponent</h2>
        <TestComponent />
      </div>
    );
  }
}

ReactDOM.render(
  <Browser />,
  document.getElementById('root')
);
