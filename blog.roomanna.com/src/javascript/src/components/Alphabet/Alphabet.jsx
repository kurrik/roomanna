/* @flow */

import * as React from 'react';
import classnames from 'classnames';

import styles from './Alphabet.css';
import type {Theme} from 'components/types';

type Props = {
  letters: Array<string>,
  rot: number,
  theme?: Theme,
};

export default class Alphabet extends React.PureComponent<Props> {
  static defaultProps = {
    letters: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    rot: 0,
  };

  render() {
    const {letters, rot, theme} = this.props;
    const listItems = letters.map((letter, index) => {
        const rotLetter = letters[(index + rot) % letters.length];
        return (<span key={letter} className={styles.letter}>{rotLetter}</span>);
      }
    );
    const className = classnames(styles.alphabet, styles[theme]);
    return (
      <div className={className}>
        <div className={styles.container}>{listItems}</div>
      </div>
    )
  }
}
