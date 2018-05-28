/* @flow */

import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

import Section, {SectionSublabel} from './Section';
import Slider from 'components/Slider';
import EditableText from 'components/EditableText';

const initialState = {
  slider: 50,
  text: 'foo',
}

const ONSLIDER = 'roomanna/componentbrowser/ONSLIDER';
const ONTEXT = 'roomanna/componentbrowser/ONTEXT';

function reducer(state = initialState, action) {
  switch (action.type) {
    case ONSLIDER:
      return { ...state, slider: action.value };
    case ONTEXT:
      return { ...state, text: action.value };
    default:
      return state;
  }
}

const store = createStore(reducer);

const SliderContainer = connect(
  state => {
    return {
      value: state.slider,
    };
  },
  dispatch => {
    return {
      onValue: x => { dispatch({ type: ONSLIDER, value: x}); },
    };
  }
)(Slider);

const EditableTextContainer = connect(
  state => {
    return {
      text: state.text,
    };
  },
  dispatch => {
    return {
      onChange: x => { dispatch({ type: ONTEXT, value: x}); },
    };
  }
)(EditableText);

export default class SectionControls extends React.Component<{}> {

  render() {
    return (
      <Provider store={store}>
        <Section title='Controls'>
          <SectionSublabel>Slider</SectionSublabel>
          <SliderContainer min={0} max={100} />
          <SectionSublabel>EditableText</SectionSublabel>
          <EditableTextContainer />
        </Section>
      </Provider>
    );
  }
}
