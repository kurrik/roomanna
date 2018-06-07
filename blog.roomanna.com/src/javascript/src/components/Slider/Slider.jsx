/* @flow */

import * as React from 'react';
import classnames from 'classnames';

import styles from './Slider.css';
import type {Theme} from 'components/types';

type Props = {
  value: number,
  onValue?: (number) => void,
  formatDisplay: (number) => string,
  min: number,
  max: number,
  step: number,
  theme?: Theme,
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
    const {min, max, step, formatDisplay, theme, value} = this.props;
    const className = classnames(styles.slider, styles[theme]);
    return (
      <div className={className}>
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
