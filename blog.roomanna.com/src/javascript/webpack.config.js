const path = require('path');
const webpack = require('webpack');
const PROD = JSON.parse(process.env.PROD || '0');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const StaticPath = path.join(__dirname, '../../build/content/static');

var config = {
  mode: PROD ? 'production' : 'development',
  entry: {
    'common': ['jquery', 'bootstrap'],
    'components': './src/components/ComponentBrowser/index.jsx',
    'roomanna': './src/roomanna/main.js',
    'post031': './src/post031/main.js',
    'post032': './src/post032/main.js',
    'post035': './src/post035/main.js',
    'post038': './src/post038/main.js',
    'post039': './src/post039/main.jsx',
    'post044': './src/post044/main.jsx',
    'post045': './src/post045/main.jsx',
    'post050': './src/post050/main.js'
  },
  output: {
    path: StaticPath,
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
              presets: ['@babel/preset-env', '@babel/preset-react'],
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
              sourceMap: true,
              importLoaders: 3,
              url: false,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
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
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]'
              },
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
          },
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
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]'
              },
            }
          },
          {
            loader: 'postcss-loader'
          },
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
      // Other images and fonts.
      {
        test: /\.(gif|png|svg|eot|woff|ttf|otf)([?#]+[a-zA-Z0-9]*)?$/,
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
    extensions: ['.js', '.jsx', '.scss'],
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
    new CopyPlugin({
      patterns: [
        { from: '../img', to: path.join(StaticPath, 'img') },
        { from: '../../lib/visitor1', to: path.join(StaticPath, 'font') },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
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
