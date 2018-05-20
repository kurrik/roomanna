/* @flow */

import * as React from 'react';

import styles from './Section.css';

export type SectionProps = {
  title: string,
  children?: React.Node,
};

type SectionSublabelProps = {
  children?: React.Node,
}

export class SectionSublabel extends React.Component<SectionSublabelProps> {
  render() {
    return (<h4>{this.props.children}</h4>);
  }
}

export default class Section extends React.Component<SectionProps> {
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
