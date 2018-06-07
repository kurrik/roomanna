/* @flow */

import * as React from 'react';
import classnames from 'classnames';

import styles from './EditableText.css';
import type {Theme} from 'components/types';

type Props = {
  text: string,
  theme?: Theme,
  onChange?: (string) => void,
};

export default class EditableText extends React.PureComponent<Props> {
  static defaultProps = {
    text: '',
  };

  handleChange(evt: SyntheticInputEvent<HTMLInputElement>) {
    const {onChange} = this.props;
    if (onChange) {
      onChange(evt.target.value);
    }
  }

  render() {
    const {text, theme} = this.props;
    const className = classnames(styles.editableText, styles[theme]);
    return (
      <div
        className={className}
        contentEditable
        suppressContentEditableWarning
        onChange={this.handleChange.bind(this)}
      >
        {text}
      </div>
    );
  }
}

