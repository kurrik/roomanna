/* @flow */

import * as React from 'react';

import styles from './EditableText.css';

type Props = {
  text: string,
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
    const {text} = this.props;
    return (
      <div
        className={styles.editableText}
        contentEditable
        suppressContentEditableWarning
        onChange={this.handleChange.bind(this)}
      >
        {text}
      </div>
    );
  }
}

