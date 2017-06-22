/* @flow */

import React from 'react';
import type { Children } from 'react';

import styles from './Section.css';

export type SectionProps = {
  title: string,
  children?: Children,
};

export default class Section extends React.Component<any, SectionProps, any> {
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
