/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import Alphabet from 'components/Alphabet';
import Dropdown from 'components/Dropdown';
import EditableText from 'components/EditableText';
import Histogram from 'components/Histogram';
import Slider from 'components/Slider';
import Table from 'components/Table';

// Text from http://www.gutenberg.org/files/42455/42455-0.txt

const initialState = computeState({
  alphabet: 'abcdefghijklmnopqrstuvwxyz',
  rot: 13,
  englishFrequencies: [
    { label: 'A', value: 0.0812 },
    { label: 'B', value: 0.0149 },
    { label: 'C', value: 0.0271 },
    { label: 'D', value: 0.0432 },
    { label: 'E', value: 0.1202 },
    { label: 'F', value: 0.0230 },
    { label: 'G', value: 0.0203 },
    { label: 'H', value: 0.0592 },
    { label: 'I', value: 0.0731 },
    { label: 'J', value: 0.0010 },
    { label: 'K', value: 0.0069 },
    { label: 'L', value: 0.0398 },
    { label: 'M', value: 0.0261 },
    { label: 'N', value: 0.0695 },
    { label: 'O', value: 0.0768 },
    { label: 'P', value: 0.0182 },
    { label: 'Q', value: 0.0011 },
    { label: 'R', value: 0.0602 },
    { label: 'S', value: 0.0628 },
    { label: 'T', value: 0.0910 },
    { label: 'U', value: 0.0288 },
    { label: 'V', value: 0.0111 },
    { label: 'W', value: 0.0209 },
    { label: 'X', value: 0.0017 },
    { label: 'Y', value: 0.0211 },
    { label: 'Z', value: 0.0007 },
  ],
  plaintextFrequencies: [],
  rotFrequencies: [],
  text: cleanText(`
    As the signs of our code were already complete we had only to fix on
    some means of signalling 'A' and 'B'. This we did by deciding that by
    daylight A should be signified by red and B by white and at night A by
    red and B by green. Thus by daylight two pocket handkerchiefs of red
    and white or two flowers of white and red; or a piece of paper and
    a red leaf or flower would suffice. We fixed on colour as the best
    representative, as the distance made simplicity necessary. By night an
    ordinary bicycle lamp with the lens covered could be used; the ordinary
    red and green side lights could be shown as required. Then and there we
    arranged that that very afternoon when I had left the castle I should
    steal back to the monument and we should make a trial of our signalling.
  `),
  rotText: '',
  statistics: [],
  statisticsTable: [],
  distanceMeasures: [
    { label: 'Hellinger Distance', func: distanceHellinger },
    { label: 'Manhattan Distance', func: distanceManhattan },
    { label: 'Euclidian Distance', func: distanceEuclidian },
    { label: 'Chybyshev Distance', func: distanceChybyshev },
    { label: 'Fractional Distance (p=0.1)', func: distanceFractional(0.1) },
    { label: 'Fractional Distance (p=0.5)', func: distanceFractional(0.5) },
    { label: 'Fractional Distance (p=0.9)', func: distanceFractional(0.9) },
    { label: 'Histogram Intersection', func: distanceIntersection },
    { label: 'Cosine Distance', func: distanceCosine },
    { label: 'Canberra Distance', func: distanceCanberra },
    { label: 'Pearson\'s Correlation Coefficient', func: distancePearson },
    { label: 'χ2 Statistics', func: distanceXSquared },
  ],
  distanceSelected: 2,
});

const ONVALUE = 'roomanna/post044/ONVALUE';
const ONTEXT = 'roomanna/post044/ONTEXT';
const ONDIST = 'roomanna/post044/ONDIST';

function cleanText(text) {
  return text.split('\n')
    .map(t => t.trim())
    .filter(l => l.length > 0)
    .join(' ');
}

// Number of mismatched values.
function distanceHellinger(a, b) {
  var delta = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    if (a[i].value != b[i].value) {
      delta++;
    }
  }
  return delta;
}

// Linear distance.
function distanceManhattan(a, b) {
  var delta = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    const diff = Math.abs(a[i].value - b[i].value);
    delta += diff;
  }
  return delta;
}

// Squared distance.
function distanceEuclidian(a, b) {
  var delta = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    const diff = Math.abs(a[i].value - b[i].value);
    delta += diff * diff;
  }
  // Should take square root, but not needed for comparison.
  return delta;
}

// Maximum distance between two buckets.
function distanceChybyshev(a, b) {
  var delta = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    const diff = Math.abs(a[i].value - b[i].value);
    if (diff > delta) {
      delta = diff;
    }
  }
  return delta;
}

// Minkowski distance family.
function distanceFractional(p) {
  return (a, b) => {
    var delta = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].label !== b[i].label) {
        console.log("Warning: invalid comparison", a, b);
      }
      const diff = Math.abs(a[i].value - b[i].value);
      delta += Math.pow(diff, p);
    }
    return Math.pow(delta, 1/p);
  }
}

// Histogram intersection.
function distanceIntersection(a, b) {
  var delta = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    delta += Math.min(a[i].value, b[i].value);
  }
  return 1 - delta;
}

// Cosine distance.
// https://en.wikipedia.org/wiki/Cosine_similarity
function distanceCosine(a, b) {
  var numer = 0;
  var denoma = 0;
  var denomb = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    numer += a[i].value * b[i].value;
    denoma += a[i].value * a[i].value;
    denomb += b[i].value * b[i].value;
  }
  const delta = numer / (Math.sqrt(denoma) * Math.sqrt(denomb));
  return 1 - delta;
}

// Canberra distance.
// https://en.wikipedia.org/wiki/Canberra_distance
function distanceCanberra(a, b) {
  var delta = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    const numer = Math.abs(a[i].value - b[i].value);
    const denom = Math.abs(a[i].value) + Math.abs(b[i].value);
    delta += numer / denom;
  }
  return delta;
}

// Pearson's Correlation Coefficient
// https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
function distancePearson(a, b) {
  const n = a.length;
  var numer = 0;
  var denoma = 0;
  var denomb = 0;
  for (var i = 0; i < n; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    const ha = a[i].value - 1/n;
    const hb = b[i].value - 1/n;
    numer += ha * hb;
    denoma += ha * ha;
    denomb += hb * hb;
  }
  const delta = numer / (Math.sqrt(denoma * denoma) * Math.sqrt(denomb * denomb));
  return 1 - delta;
}

// χ2 Statistics
function distanceXSquared(a, b) {
  var delta = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    const diff = a[i].value - b[i].value;
    const sum = a[i].value + b[i].value;
    delta += (diff * diff) / sum;
  }
  return delta;
}

function diffHistograms(a, b) {
  var delta = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label) {
      console.log("Warning: invalid comparison", a, b);
    }
    // TODO: implement switching between https://stats.stackexchange.com/questions/7400/how-to-assess-the-similarity-of-two-histograms
    const observed = a[i].value;
    const expected = b[i].value;
    const diff = Math.abs(observed - expected);
    delta += diff;
  }
  return delta;
}

function rotText(text, rot, alphabet) {
  var output = [];
  var offset = 0;
  const baseOffset = 'A'.charCodeAt(0);
  const alphabetSize = alphabet.length;
  for (var i = 0; i < text.length; i++) {
    const c = text[i].toUpperCase();
    if (c >= 'A' && c <= 'Z') {
      const startLetterIndex = c.charCodeAt(0) - baseOffset;
      const endLetterIndex = (startLetterIndex + rot + alphabetSize) % alphabetSize;
      offset = endLetterIndex - startLetterIndex;
      output.push(String.fromCharCode(text.charCodeAt(i) + offset));
    } else {
      output.push(text[i]);
    }
  }
  return output.join('');
}

function computeHistogram(text, alphabet) {
  const letters: Map<string, number> = new Map();
  for (var i = 0; i < alphabet.length; i++) {
    letters.set(alphabet[i].toUpperCase(), 0);
  }
  var total = 0;
  for (var i = 0; i < text.length; i++) {
    const c = text[i].toUpperCase();
    if (letters.has(c)) {
      letters.set(c, letters.get(c) + 1);
      total += 1;
    }
  }
  return [...letters.entries()]
    .map(x => ({label: x[0], value: x[1] / total}))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function computeDiffText(diff, isBest, isCurrent) {
  const bestLabel = isBest ? (
    <span className="label label-success">BEST</span>
  ) : "";
  const currentLabel = isCurrent ? (
    <span className="label label-primary">CURRENT</span>
  ) : "";
  return (
    <span><span>{diff}</span> {bestLabel} {currentLabel}</span>
  );
}

function computeState(state) {
  state.rotText = rotText(state.text, state.rot, state.alphabet);
  state.plaintextFrequencies = computeHistogram(state.text, state.alphabet);
  state.rotFrequencies = computeHistogram(state.rotText, state.alphabet);
  const diffFunction = state.distanceMeasures[state.distanceSelected].func;
  for (var i = 0; i < state.alphabet.length; i++) {
    const text = rotText(state.rotText, -i, state.alphabet);
    const freqs = computeHistogram(text, state.alphabet);
    state.statistics[i] = {
      rot: i,
      diff: diffFunction(freqs, state.englishFrequencies),
    };
  }
  state.statistics.sort((a, b) => a.diff - b.diff);
  state.statisticsTable = [
    { columns: ['Rot', 'Diff'] },
    ...state.statistics.map((s, i) => ({
      className: 'foo',
      columns: [
        s.rot,
        computeDiffText(s.diff, i == 0, s.rot == state.rot),
      ],
    }))
  ];
  return state;
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case ONVALUE:
      return computeState({ ...state, rot: action.value });
    case ONTEXT:
      return computeState({ ...state, text: action.text });
    case ONDIST:
      return computeState({ ...state, distanceSelected: action.value });
    default:
      return state;
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const AlphabetContainer = connect(
  state => ({ letters: state.alphabet.split('') }),
)(Alphabet);

const RotAlphabetContainer = connect(
  state => ({ letters: state.alphabet.split(''), rot: state.rot }),
)(Alphabet);

const SliderContainer = connect(
  state => ({ value: state.rot }),
  dispatch => ({ onValue: x => { dispatch({ type: ONVALUE, value: x}); }}),
)(Slider);

const HistogramContainer = connect(
  state => ({ data: state.englishFrequencies }),
)(Histogram);

const RotHistogramContainer = connect(
  state => ({ data: state.rotFrequencies }),
)(Histogram);

const PlaintextHistogramContainer = connect(
  state => ({ data: state.plaintextFrequencies }),
)(Histogram);

const EditableTextContainer = connect(
  state => ({ text: state.text }),
  dispatch => ({ onChange: x => { dispatch({ type: ONTEXT, text: x}); }}),
)(EditableText);

const RotTextContainer = connect(
  state => ({ text: state.rotText, disabled: true }),
)(EditableText);

const TableContainer = connect(
  state => ({ data: state.statisticsTable, headerRows: 1 }),
)(Table);

const DistanceDropdown = connect(
  state => ({ value: state.distanceSelected, entries: state.distanceMeasures }),
  dispatch => ({ onValue: x => { dispatch({ type: ONDIST, value: x}); }}),
)(Dropdown);


const demoAlphabet = document.getElementById('demo-alphabet');
if (demoAlphabet) {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <AlphabetContainer theme='blue' />
        <RotAlphabetContainer theme='purple' />
        <SliderContainer min={0} max={25} theme='purple' />
      </div>
    </Provider>,
    demoAlphabet
  );
}

const demoText = document.getElementById('demo-text');
if (demoText) {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <EditableTextContainer theme='blue' />
        <RotTextContainer theme='purple' />
        <SliderContainer min={0} max={25} theme='purple' />
      </div>
    </Provider>,
    demoText
  );
}

const testElement = document.getElementById('test');
if (testElement) {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <HistogramContainer theme='green' />
        <PlaintextHistogramContainer theme='blue' />
        <RotHistogramContainer theme='purple' />
        <DistanceDropdown theme='green' />
        <TableContainer />
      </div>
    </Provider>,
    testElement
  );
}
