var path = require('path');
var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD || '0');

var config = {
  entry: {
    'common': ['jquery', 'bootstrap'],
    'roomanna': './src/roomanna/main.js',
    'post031': './src/post031/main.js',
    'post032': './src/post032/main.js',
    'post035': './src/post035/main.js'
  },
  output: {
    path: path.join(__dirname, '../../build/content/static/js'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: { presets: ['es2015'], cacheDirectory: true }
      }
    ]
  },
  resolve: {
    alias: {
      'lib': path.join(__dirname, 'lib')
    }
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ]
};

if (PROD) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false }
  }));
} else {
  config.devtool = '#inline-source-map';
}

module.exports = config;
