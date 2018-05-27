/* @flow */

import * as React from 'react';

import styles from './Slider.css';

type Props = {
  value: number,
  onValue?: (number) => void,
  formatDisplay: (number) => string,
  min: number,
  max: number,
  step: number,
};

export default class Slider extends React.PureComponent<Props> {
  static defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    formatDisplay: (x: number) => { return x.toString(); },
  };

  handleChange(evt: SyntheticInputEvent<HTMLInputElement>) {
    const {onValue} = this.props;
    if (onValue) {
      const value = parseFloat(evt.target.value);
      onValue(value);
    }
  }

  render() {
    const {min, max, step, value, formatDisplay} = this.props;
    return (
      <div className={styles.slider}>
        <input
          className={styles.sliderInput}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={this.handleChange.bind(this)}
        />
        <span className={styles.sliderDisplay}>{formatDisplay(value)}</span>
      </div>
    );
  }
}
