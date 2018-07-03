const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  entry: {
    app: [
      path.join(__dirname, '../src/index.js'),
    ],
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin([path.join(__dirname, '../build')]),
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
})
