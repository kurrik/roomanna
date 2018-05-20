/* @flow */

import * as React from 'react';
import classNames from 'classnames';

import Section from 'components/ComponentBrowser/Section';
import type { SectionProps } from 'components/ComponentBrowser/Section';

import styles from 'components/ComponentBrowser/ComponentBrowser.css';

type Props = {
  children?: React.Node,
};

export default class ComponentBrowser extends React.Component<Props> {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.wrapper}>
        <h1>Component Browser</h1>
        {children}
      </div>
    );
  }
}
