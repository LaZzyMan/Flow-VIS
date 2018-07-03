const webpack = require('webpack')
const path = require('path')
const Dashboard = require('webpack-dashboard')
const DashboardPlugin = require('webpack-dashboard/plugin')
const merge = require('webpack-merge')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const baseConfig = require('./webpack.base.config')

const dashboard = new Dashboard()

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../src/index.js'),
    ],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new DashboardPlugin(dashboard.setData),
  ],
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, '../dist'),
    historyApiFallback: true,
    host: 'localhost',
    quiet: true,
  },
  stats: {
    children: false,
  },
})
