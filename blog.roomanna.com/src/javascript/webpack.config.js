var path = require('path');
var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD || '0');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: {
    'common': ['jquery', 'bootstrap'],
    'roomanna': './src/roomanna/main.js',
    'post031': './src/post031/main.js',
    'post032': './src/post032/main.js',
    'post035': './src/post035/main.js',
    'post038': './src/post038/main.js'
  },
  output: {
    path: path.join(__dirname, '../../build/content/static'),
    filename: 'js/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: { presets: ['es2015'], cacheDirectory: true }
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        loader: ExtractTextPlugin.extract([
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        ])
      },
      {
        test: /\.(gif|png|svg)$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'lib': path.join(__dirname, 'lib'),
      'default-skin.png': path.join(__dirname, 'node_modules/photoswipe/dist/default-skin/default-skin.png'),
      'default-skin.svg': path.join(__dirname, 'node_modules/photoswipe/dist/default-skin/default-skin.svg'),
      'preloader.gif': path.join(__dirname, 'node_modules/photoswipe/dist/default-skin/preloader.gif')
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
    }),
    new ExtractTextPlugin('css/[name].css')
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
