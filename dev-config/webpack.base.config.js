const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader?cacheDirectory=true'],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-sprite-loader',
          options: {
            symbolId: 'icon-[name]',
          },
        },
        include: [path.join(__dirname, '../src/icons')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]',
          },
        },
        exclude: [path.join(__dirname, '../src/icons')],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]',
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      pages: path.join(__dirname, '../src/pages'),
      component: path.join(__dirname, '../src/component'),
      router: path.join(__dirname, '../src/router'),
      actions: path.join(__dirname, '../src/redux/actions'),
      reducers: path.join(__dirname, '../src/redux/reducers'),
    },
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          enforce: true,
          chunks: 'initial',
        },
      },
    },
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../src/index.ejs'),
      title: 'TS Management',
      favicon: path.join(__dirname, '../src/icons/favicon.ico'),
      appMountId: 'app',
      minify: {
        html5: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        removeComments: true,
        keepClosingSlash: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    }),
  ],
  eslint: {
    configFile: path.join(__dirname, '../.eslintrc.js'),
  },
}
