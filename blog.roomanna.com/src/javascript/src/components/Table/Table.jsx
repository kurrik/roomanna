/* @flow */

import * as React from 'react';
import classnames from 'classnames';

type Row = {
  className?: string,
  columns: Array<number | string | React.Node>,
}

type Props = {
  data: Array<Row>,
  headerRows: number,
  headerCols: number,
};

export default class Table extends React.PureComponent<Props> {
  static defaultProps = {
    headerRows: 0,
    headerCols: 0,
    data: [],
  };

  render() {
    const {headerRows, headerCols, data} = this.props;
    const head = [];
    const body = [];

    for (var i = 0; i < headerRows; i++) {
      head.push(
        <tr key={i} className={data[i].className}>
          {data[i].columns.map((col, j) => (
            <th scope="col" key={j}>{col}</th>
          ))}
        </tr>
      );
    }

    for (var i = headerRows; i < data.length; i++) {
      body.push(
        <tr key={i} className={data[i].className}>
          {data[i].columns.slice(0, headerCols).map((col, j) => (
            <th scope="row" key={j}>{col}</th>
          ))}
          {data[i].columns.slice(headerCols).map((col, j) => (
            <td key={j}>{col}</td>
          ))}
        </tr>
      );
    }

    return (
      <table className="table">
        <thead>
          {head}
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>
    );
  }
}
