import React from 'react';
import ReactDOM from 'react-dom';

export default class TestComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      on: true
    };
  }

  handleClick = () => {
    this.setState(prevState => ({
      on: !prevState.on
    }));
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.on ? 'ON' : 'OFF'}
      </button>
    );
  }
}
