/* @flow */

import React from 'react';
import type { Children } from 'react';
import classNames from 'classnames';

import SectionBase from 'components/ComponentBrowser/SectionBase';
import type { SectionBaseProps } from 'components/ComponentBrowser/SectionBase';

import styles from 'components/ComponentBrowser/ComponentBrowser.css';

export default class ComponentBrowser extends React.Component {
  props: {
    sections?: Array<React$Element<SectionBaseProps>>,
  };

  render() {
    const {sections} = this.props;
    return (
      <div className={styles.wrapper}>
        <h1>Component Browser</h1>
        {sections}
      </div>
    );
  }
}
