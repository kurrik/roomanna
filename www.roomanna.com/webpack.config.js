const path = require('path');
const webpack = require('webpack');
const PROD = !!!JSON.parse(process.env.DEVEL || '0'); // Defaults to PROD unless DEVEL=1
const PUBLIC_PREFIX = PROD ? 'static/' : 'static/dev/';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var config = {
  mode: PROD ? 'production' : 'development',
  entry: {
    'common': ['jquery', 'bootstrap'],
    'splash': path.join(__dirname, 'src/splash/main.js'),
  },
  output: {
    path: path.join(__dirname, 'src/server', PUBLIC_PREFIX),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      // Javascript.
      {
        test: [
          /\.jsx$/,
          /\.js$/
        ],
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react', 'stage-0'],
              cacheDirectory: true
            }
          },
        ]
      },
      // Minimized CSS.
      {
        test: /\.min\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // Sass global styles.
      {
        test: /\.global\.scss$/,
        exclude: /(node_modules)/,
        use: [
          PROD ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      // Sass modules.
      {
        test: /\.scss$/,
        exclude: [
          /(node_modules)/,
          /\.global\.scss$/,
        ],
        use: [
          PROD ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      // CSS global styles.
      {
        test: /\.global\.css$/,
        exclude: /(node_modules)/,
        use: [
          PROD ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      // CSS modules.
      {
        test: /\.css$/,
        exclude: [
          /(node_modules)/,
          /\.global\.css$/,
        ],
        use: [
          PROD ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      // HTML.
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].[ext]' }
          }
        ]
      },
      // Images and fonts.
      {
        test: /\.(gif|png|svg|eot|woff|ttf|otf)$/,
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
      'lib': path.join(__dirname, 'lib'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new FlowBabelWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
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
  },
  devServer: {
    index: '', // specify to enable root proxying
    host: 'localhost',
    port: 8081,
    contentBase: path.join(__dirname, 'src/server/static'),
    publicPath: '/static/',
    proxy: {
      context: () => true,
      target: 'http://localhost:8080'
    }
  }
};

if (PROD) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    })
  );
} else {
  config.devtool = '#inline-source-map';
}

module.exports = config;
