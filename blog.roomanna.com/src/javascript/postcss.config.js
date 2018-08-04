module.exports = {
  plugins: {
    'postcss-mixins': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }
  }
};
