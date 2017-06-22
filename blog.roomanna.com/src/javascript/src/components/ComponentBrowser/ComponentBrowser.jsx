/* @flow */

import React from 'react';
import type { Children } from 'react';
import classNames from 'classnames';

import Section from 'components/ComponentBrowser/Section';
import type { SectionProps } from 'components/ComponentBrowser/Section';

import styles from 'components/ComponentBrowser/ComponentBrowser.css';

export default class ComponentBrowser extends React.Component {
  props: {
    children?: Children,
  };

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
