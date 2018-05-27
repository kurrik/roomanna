/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import Alphabet from 'components/Alphabet';
import Slider from 'components/Slider';

const initialState = {
  alphabet: 'abcdefghijklmnopqrstuvwxyz',
  rot: 13,
}

const ONVALUE = 'roomanna/post044/ONVALUE';

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
  state => {
    return {
      letters: state.alphabet.split(''),
    };
  },
)(Alphabet);

const RotAlphabetContainer = connect(
  state => {
    return {
      letters: state.alphabet.split(''),
      rot: state.rot,
    };
  },
)(Alphabet);

const SliderContainer = connect(
  state => {
    return {
      value: state.rot
    };
  },
  dispatch => {
    return {
      onValue: x => { dispatch({ type: ONVALUE, value: x}); },
    };
  }
)(Slider);

const testElement = document.getElementById('test');
if (testElement) {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <AlphabetContainer />
        <RotAlphabetContainer />
        <SliderContainer min={0} max={26} />
      </div>
    </Provider>,
    testElement
  );
}
