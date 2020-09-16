module.exports = {
  plugins: [
    require('autoprefixer'),
    require('precss'),
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }),
  ]
};
