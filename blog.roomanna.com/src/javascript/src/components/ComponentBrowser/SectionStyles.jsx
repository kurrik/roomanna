/* @flow */

import React from 'react';

import Section, {SectionSublabel} from './Section';

export default class SectionStyles extends React.Component<{}> {
  render() {
    return (
      <Section title='Styles'>
        <SectionSublabel>Inline styles</SectionSublabel>
        <p>Testing the <code>code</code> block.</p>
        <SectionSublabel>Tables</SectionSublabel>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Boo</td>
              <td>Berry</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Captain</td>
              <td>Crunch</td>
            </tr>
          </tbody>
        </table>
      </Section>
    );
  }
}
