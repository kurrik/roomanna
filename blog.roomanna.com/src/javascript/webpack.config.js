var path = require('path');
var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD || '0');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');

var config = {
  mode: 'none', // TODO: Replace with prod / dev and remove optimization plugins.
  entry: {
    'common': ['jquery', 'bootstrap'],
    'components': './src/components/ComponentBrowser/index.jsx',
    'roomanna': './src/roomanna/main.js',
    'post031': './src/post031/main.js',
    'post032': './src/post032/main.js',
    'post035': './src/post035/main.js',
    'post038': './src/post038/main.js',
    'post039': './src/post039/main.jsx',
    'post044': './src/post044/main.jsx'
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
            options: { presets: ['env'], cacheDirectory: true }
          }
        ],
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['env', 'react', 'stage-0'], cacheDirectory: true }
          },
        ]
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: [
          //PROD ? MiniCssExtractPlugin.loader : 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: 'modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          },
          {
            loader: 'postcss-loader',
          }
        ]
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
      './common/roomanna.config.css': path.join(__dirname, 'src/common/roomanna.config.css'),
      'components': path.join(__dirname, 'src/components'),
      'lib': path.join(__dirname, 'lib'),
      'default-skin.png': path.join(__dirname, 'node_modules/photoswipe/dist/default-skin/default-skin.png'),
      'default-skin.svg': path.join(__dirname, 'node_modules/photoswipe/dist/default-skin/default-skin.svg'),
      'preloader.gif': path.join(__dirname, 'node_modules/photoswipe/dist/default-skin/preloader.gif')
    },
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new FlowBabelWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          test: /\.js$/,
          name: 'common',
          enforce: true
        }
      }
    }
  }
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
