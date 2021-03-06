import * as d3 from 'd3';
import styles from './common.css';

export function drawTable(data, domRoot) {
  // Data should be an array of:
  // {
  //   index: Number
  //   label: String
  //   data: Array<Entry>
  // }

  const processedTo = parseInt(domRoot.getAttribute('data-processed-to') || '-1');
  domRoot.setAttribute('data-processed-to', data[data.length-1].index);

  const rows = d3.select(domRoot)
    .select('table tbody')
    .selectAll('tr')
    .data(data);

  const newrow = rows.enter().append('tr');
  newrow.append('th');
  newrow.append('td');

  rows.merge(newrow)
    .classed(styles.newRow, (x) => x.index > processedTo)
    .attr('data-index', (x) => x.index)
    .select('th').text((x) => x.label);

  rows.exit().remove();

  const cells = d3.select(domRoot)
    .select('table tbody')
    .selectAll('tr')
    .select('td')
    .selectAll(`div.${styles.entry}`)
    .data((x) => x.data);

  cells
    .enter()
      .append('div')
    .merge(cells)
      .classed(styles.entry, true)
      .classed(styles.active, (p, i) => i == 0)
      .attr('data-state', (p) => p.state)
      .attr('data-index', (p) => p.index)
      .html((p) => `<span class='${styles.index}'>${p.index}:</span> <span class='${styles.value}'>${p.value}</span>`);

  cells.exit().remove();
}
