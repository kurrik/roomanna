define(['seedrandom'], function initRandom(seedrandom) {
  // Implemented from http://www.redblobgames.com/articles/noise/introduction.html

  function amplitude(f, exponent) {
    return Math.pow(f, exponent);
  };

  function getFrequencies(count) {
    var f = [], i;
    for (i = 1; i <= count; i++) { f[i-1] = i; }
    return f;
  };

  function getAmplitudes(frequencies, exponent) {
    var a = [], i;
    for (i = 0; i < frequencies.length; i++) {
      a[i] = amplitude(frequencies[i], exponent);
    }
    return a;
  };

  function noise(frequency, count, rng) {
    var phase,
        i,
        twopi = 2*Math.PI,
        n = [];
    phase = rng() * twopi;
    for (i = 0; i < count; i++) {
      n[i] = Math.sin(twopi * frequency * i / count + phase);
    }
    return n;
  };

  function getNoises(frequencies, count, rng) {
    var n = [], i;
    for (i = 0; i < frequencies.length; i++) {
      n[i] = noise(frequencies[i], count, rng);
    }
    return n;
  };

  function normalize(values) {
    var i,
        range,
        min = Number.MAX_VALUE,
        max = Number.MIN_VALUE,
        out = [];
    for (i = 0; i < values.length; i++) {
      if (values[i] < min) {
        min = values[i];
      }
      if (values[i] > max) {
        max = values[i];
      }
    }
    range = max - min;
    for (i = 0; i < values.length; i++) {
      out[i] = (values[i] - min) / range;
    }
    return out;
  }

  function weightedSum(amplitudes, noises, count) {
    var i, j, summed = [];
    for (j = 0; j < count; j++) {
      summed[j] = 0;
    }
    for (i = 0; i < noises.length; i++) {
      for (j = 0; j < count; j++) {
        summed[j] += amplitudes[i] * noises[i][j];
      }
    }
    return summed;
  };

  function randomIft(seed, exponent, count) {
    var rng,
        amplitudes,
        frequencies,
        noises,
        summed;
    rng = seedrandom(seed);
    frequencies = getFrequencies(30);
    amplitudes = getAmplitudes(frequencies, exponent);
    noises = getNoises(frequencies, count, rng);
    summed = weightedSum(amplitudes, noises, count);
    return normalize(summed);
  };

  return randomIft;
});
