var path = require('path'),
    autoprefixer = require('autoprefixer'),
    webpack = require('webpack'),
    HTMLwebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  app: path.resolve(__dirname, 'app'),
  dist: path.join(__dirname, 'dist')
};

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(PATHS.app, 'app.js'),
  output: {
    path: PATHS.dist,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new HTMLwebpackPlugin({
      title: 'ALiEMU',
      template: path.resolve(PATHS.app, 'index.templ.html'),
      inject: 'body'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
        query: {
          plugins: ['./utils/babelRelayPlugin']
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['./utils/babelRelayPlugin']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  postcss: function() { //eslint-disable-line
    return [autoprefixer];
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  }
};
