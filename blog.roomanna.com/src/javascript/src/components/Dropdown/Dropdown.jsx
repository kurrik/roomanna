/* @flow */

import * as React from 'react';
import classnames from 'classnames';

import styles from './Dropdown.css';
import type {Theme} from 'components/types';

type Entry = {
  label: string,
  value: (string | number),
};

type Props = {
  value: (string | number),
  entries: Array<Entry>,
  onValue?: (string | number) => void,
  theme?: Theme,
};

export default class Dropdown extends React.PureComponent<Props> {
  static defaultProps = {
  };

  handleChange(evt: SyntheticInputEvent<HTMLInputElement>) {
    const {onValue} = this.props;
    if (onValue) {
      onValue(evt.target.value);
    }
  }

  render() {
    const {entries, theme, value} = this.props;
    const className = classnames(styles.dropdown, styles[theme]);
    return (
      <div className={className}>
        <label>
          <select
            className={styles.sliderInput}
            onChange={this.handleChange.bind(this)}
          >
            {entries.map((e) => {
              return (
                <option selected={e.value === value} value={e.value}>{e.label}</option>
              );
            })}
          </select>
        </label>
      </div>
    );
  }
}

