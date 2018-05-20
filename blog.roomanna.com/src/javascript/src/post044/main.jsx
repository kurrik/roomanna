/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

import Alphabet from 'components/Alphabet';

const initialState = {
  alphabet: 'abc',
}

function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const store = createStore(reducer)

const AlphabetContainer = connect(
  // mapStateToProps
  state => {
    return {
      alphabet: state.alphabet,
    };
  },
  // mapDispatchToProps
  dispatch => {
    return {
      // onTodoClick: id => {
      //   dispatch(toggleTodo(id))
      // }
    };
  }
)(Alphabet);

const testElement = document.getElementById('test');
if (testElement) {
  ReactDOM.render(
    <Provider store={store}>
      <AlphabetContainer />
    </Provider>,
    testElement
  );
}
