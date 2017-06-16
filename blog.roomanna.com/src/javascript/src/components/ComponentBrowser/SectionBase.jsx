/* @flow */

import React from 'react';
import type { Children } from 'react';

import styles from './SectionBase.css';

export type SectionBaseProps = {
  title: string,
  children?: Children,
};

export default class SectionBase extends React.Component<any, SectionBaseProps, any> {
  render() {
    const {children, title} = this.props;
    return (
      <div className={styles.wrapper}>
        <h3>{title}</h3>
        {children}
      </div>
    );
  }
}
