var path = require('path');
var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD || '0');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: {
    'common': ['jquery', 'bootstrap'],
    'components': ['./src/components/index.jsx', './src/components/index.html'],
    'roomanna': './src/roomanna/main.js',
    'post031': './src/post031/main.js',
    'post032': './src/post032/main.js',
    'post035': './src/post035/main.js',
    'post038': './src/post038/main.js',
    'post039': './src/post039/main.jsx'
  },
  output: {
    path: path.join(__dirname, '../../build/content/static'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015'], cacheDirectory: true }
          }
        ],
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015', 'react', 'stage-0'], cacheDirectory: true }
          },
        ]
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        })
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].[ext]' }
          }
        ]
      },
      {
        test: /\.(gif|png|svg)$/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'components': path.join(__dirname, 'src/components'),
      'lib': path.join(__dirname, 'lib'),
      'default-skin.png': path.join(__dirname, 'node_modules/photoswipe/dist/default-skin/default-skin.png'),
      'default-skin.svg': path.join(__dirname, 'node_modules/photoswipe/dist/default-skin/default-skin.svg'),
      'preloader.gif': path.join(__dirname, 'node_modules/photoswipe/dist/default-skin/preloader.gif')
    },
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),
    new ExtractTextPlugin({ filename: 'css/[name].css' })
  ]
};

if (PROD) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    })
  );
} else {
  config.devtool = '#inline-source-map';
}

module.exports = config;
