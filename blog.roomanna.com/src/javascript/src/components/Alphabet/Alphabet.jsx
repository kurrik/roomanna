/* @flow */

import * as React from 'react';

import styles from './Alphabet.css';

type Props = {
  letters: Array<string>,
  rot: number,
};

export default class Alphabet extends React.PureComponent<Props> {
  static defaultProps = {
    letters: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    rot: 0,
  };

  render() {
    const {letters, rot} = this.props;
    const listItems = letters.map((letter, index) => {
        const rotLetter = letters[(index + rot) % letters.length];
        return (<span key={letter} className={styles.letter}>{rotLetter}</span>);
      }
    );
    return (
      <div className={styles.alphabet}>{listItems}</div>
    )
  }
}
