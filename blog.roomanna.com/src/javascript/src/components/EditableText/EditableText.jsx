/* @flow */

import * as React from 'react';
import classnames from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';

import styles from './EditableText.css';
import type {Theme} from 'components/types';

type Props = {
  disabled?: bool,
  text: string,
  theme?: Theme,
  onChange?: (string) => void,
};

export default class EditableText extends React.PureComponent<Props> {
  static defaultProps = {
    disabled: false,
    text: '',
  };

  handleChange(evt: SyntheticInputEvent<HTMLInputElement>) {
    const {onChange} = this.props;
    if (onChange) {
      onChange(evt.target.value);
    }
  }

  render() {
    const {disabled, text, theme} = this.props;
    const className = classnames(styles.editableText, styles[theme]);
    return (
      <TextareaAutosize
        disabled={disabled}
        className={className}
        onChange={this.handleChange.bind(this)}
        value={text}
      />
    );
  }
}

