module.exports = {
  plugins: {
    'autoprefixer': {},
    'precss': {},
    'postcss-mixins': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }
  }
};
