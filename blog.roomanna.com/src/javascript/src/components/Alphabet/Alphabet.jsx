/* @flow */

import * as React from 'react';

import styles from './Alphabet.css';

type Props = {
  letters: Array<string>,
};

export default class Alphabet extends React.PureComponent<Props> {
  static defaultProps = {
    letters: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  };

  render() {
    const listItems = this.props.letters.map((number) =>
      <span key={number} className={styles.letter}>{number}</span>
    );
    return (
      <div className={styles.alphabet}>{listItems}</div>
    )
  }
}
