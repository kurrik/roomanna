/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import Alphabet from 'components/Alphabet';
import Histogram from 'components/Histogram';
import EditableText from 'components/EditableText';
import Slider from 'components/Slider';

// Text from http://www.gutenberg.org/files/42455/42455-0.txt

const initialState = {
  alphabet: 'abcdefghijklmnopqrstuvwxyz',
  rot: 13,
  englishFrequencies: [
    { label: 'A', value: 0.0812 },
    { label: 'B', value: 0.0149 },
    { label: 'C', value: 0.0271 },
    { label: 'D', value: 0.0432 },
    { label: 'E', value: 0.1202 },
    { label: 'F', value: 0.0230 },
    { label: 'G', value: 0.0203 },
    { label: 'H', value: 0.0592 },
    { label: 'I', value: 0.0731 },
    { label: 'J', value: 0.0010 },
    { label: 'K', value: 0.0069 },
    { label: 'L', value: 0.0398 },
    { label: 'M', value: 0.0261 },
    { label: 'N', value: 0.0695 },
    { label: 'O', value: 0.0768 },
    { label: 'P', value: 0.0182 },
    { label: 'Q', value: 0.0011 },
    { label: 'R', value: 0.0602 },
    { label: 'S', value: 0.0628 },
    { label: 'T', value: 0.0910 },
    { label: 'U', value: 0.0288 },
    { label: 'V', value: 0.0111 },
    { label: 'W', value: 0.0209 },
    { label: 'X', value: 0.0017 },
    { label: 'Y', value: 0.0211 },
    { label: 'Z', value: 0.0007 },
  ],
  text: `
    We found the spot which I had indicated admirably adapted for our
    purpose. One could sit on the stone roof, well back from the wall, and
    through one of the openings in the castellation see the top of the
    monument amongst the tree tops; and could yet be unobserved oneself from
    any other spot around. The angles of the castellation of the various
    walls shut out the tops of the other hills or mounds on every side.
    As the signs of our code were already complete we had only to fix on
    some means of signalling 'A' and 'B'. This we did by deciding that by
    daylight A should be signified by red and B by white and at night A by
    red and B by green. Thus by daylight two pocket handkerchiefs of red
    and white or two flowers of white and red; or a piece of paper and
    a red leaf or flower would suffice. We fixed on colour as the best
    representative, as the distance made simplicity necessary. By night an
    ordinary bicycle lamp with the lens covered could be used; the ordinary
    red and green side lights could be shown as required. Then and there we
    arranged that that very afternoon when I had left the castle I should
    steal back to the monument and we should make a trial of our signalling.
  `,
}

const ONVALUE = 'roomanna/post044/ONVALUE';
const ONTEXT = 'roomanna/post044/ONTEXT';

function reducer(state = initialState, action) {
  switch (action.type) {
    case ONVALUE:
      return { ...state, rot: action.value };
    case ONTEXT:
      return { ...state, text: action.text };
    default:
      return state;
  }
}

const store = createStore(reducer);

const AlphabetContainer = connect(
  state => ({ letters: state.alphabet.split('') }),
)(Alphabet);

const RotAlphabetContainer = connect(
  state => ({ letters: state.alphabet.split(''), rot: state.rot }),
)(Alphabet);

const SliderContainer = connect(
  state => ({ value: state.rot }),
  dispatch => ({ onValue: x => { dispatch({ type: ONVALUE, value: x}); }}),
)(Slider);

const HistogramContainer = connect(
  state => ({ data: state.englishFrequencies }),
)(Histogram);

const EditableTextContainer = connect(
  state => ({ text: state.text }),
  dispatch => ({ onChange: x => { dispatch({ type: ONTEXT, text: x}); }}),
)(EditableText);

const testElement = document.getElementById('test');
if (testElement) {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <AlphabetContainer />
        <RotAlphabetContainer />
        <SliderContainer min={0} max={26} />
        <HistogramContainer />
        <EditableTextContainer />
      </div>
    </Provider>,
    testElement
  );
}
