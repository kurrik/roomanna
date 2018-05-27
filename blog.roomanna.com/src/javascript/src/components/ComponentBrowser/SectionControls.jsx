/* @flow */

import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

import Section, {SectionSublabel} from './Section';
import Slider from 'components/Slider';
import sliderReducer, {onValue} from 'components/Slider/ducks';

const initialState = {
  value: 50,
}

const store = createStore(sliderReducer);

const SliderContainer = connect(
  // mapStateToProps
  state => {
    return {
      value: state.value,
    };
  },
  // mapDispatchToProps
  dispatch => {
    return {
      onValue: x => {
        dispatch(onValue(x, 'value'));
      }
    };
  }
)(Slider);


export default class SectionControls extends React.Component<{}> {

  render() {
    return (
      <Provider store={store}>
        <Section title='Controls'>
          <SectionSublabel>Slider</SectionSublabel>
          <SliderContainer min={0} max={100} />
        </Section>
      </Provider>
    );
  }
}
