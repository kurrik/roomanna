/* @flow */

import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

import Section, {SectionSublabel} from './Section';

import Dropdown from 'components/Dropdown';
import EditableText from 'components/EditableText';
import Slider from 'components/Slider';

const initialState = {
  slider: 50,
  text: 'foo',
  dropdownEntries: [
    { value: 'foo', label: 'Foo' },
    { value: 'bar', label: 'Bar' },
  ],
  dropdownValue: 'foo',
}

const ONDROPDOWN = 'roomanna/componentbrowser/ONDROPDOWN';
const ONSLIDER = 'roomanna/componentbrowser/ONSLIDER';
const ONTEXT = 'roomanna/componentbrowser/ONTEXT';

function reducer(state = initialState, action) {
  switch (action.type) {
    case ONDROPDOWN:
      return { ...state, dropdownValue: action.value };
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

const DropdownContainer = connect(
  state => {
    return {
      value: state.dropdownValue,
      entries: state.dropdownEntries,
    };
  },
  dispatch => {
    return {
      onValue: x => { dispatch({ type: ONDROPDOWN, value: x}); },
    };
  }
)(Dropdown);

export default class SectionControls extends React.Component<{}> {

  render() {
    return (
      <Provider store={store}>
        <Section title='Controls'>
          <SectionSublabel>Slider</SectionSublabel>
          <SliderContainer min={0} max={100} />
          <SliderContainer theme="blue" min={0} max={100} />
          <SliderContainer theme="red" min={0} max={100} />
          <SliderContainer theme="yellow" min={0} max={100} />
          <SliderContainer theme="green" min={0} max={100} />
          <SliderContainer theme="purple" min={0} max={100} />

          <SectionSublabel>Dropdown</SectionSublabel>
          <div>
            This is a Dropdown container <DropdownContainer /> inline in text.
            And here is a blue one <DropdownContainer theme="blue" />,
            and a red one <DropdownContainer theme="red" />,
            and a yellow one <DropdownContainer theme="yellow" />,
            and a green one <DropdownContainer theme="green" />,
            and a purple one <DropdownContainer theme="purple" />
          </div>

          <SectionSublabel>EditableText</SectionSublabel>
          <EditableTextContainer />
          <EditableTextContainer theme="blue" />
          <EditableTextContainer theme="red" />
          <EditableTextContainer theme="yellow" />
          <EditableTextContainer theme="green" />
          <EditableTextContainer theme="purple" />
        </Section>
      </Provider>
    );
  }
}
