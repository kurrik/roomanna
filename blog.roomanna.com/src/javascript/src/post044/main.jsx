/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import Alphabet from 'components/Alphabet';
import Slider from 'components/Slider';
import sliderReducer, {onValue, ONVALUE} from 'components/Slider/ducks';

const initialState = {
  alphabet: 'abc',
  rot: 13,
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case ONVALUE:
      return { ...state, rot: action.value };
    default:
      return state;
  }
}

const store = createStore(reducer);

const AlphabetContainer = connect(
  // mapStateToProps
  state => {
    return {
      letters: state.alphabet.split(''),
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

const SliderContainer = connect(
  state => {
    return {
      value: state.rot
    };
  },
  dispatch => {
    return {
      onValue: x => { dispatch(onValue(x)); },
    };
  }
)(Slider);

const testElement = document.getElementById('test');
if (testElement) {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <AlphabetContainer />
        <SliderContainer min={0} max={26} />
      </div>
    </Provider>,
    testElement
  );
}
