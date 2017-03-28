var path = require('path');
var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD || '0');
var PUBLIC_PREFIX = PROD ? 'static/' : 'static/dev/';
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: {
    'common': ['jquery', 'bootstrap'],
    'splash': path.join(__dirname, 'src/splash/main.js'),
  },
  output: {
    path: path.join(__dirname, 'src/server', PUBLIC_PREFIX),
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
        test: /\.(otf)$/,
        loader: 'file-loader?name=fonts/[name].[ext]&publicPath=/' + PUBLIC_PREFIX
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
