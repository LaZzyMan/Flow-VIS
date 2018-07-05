module.exports = {
  parser: 'postcss-scss',
  syntax: 'postcss-scss',
  plugins: [
    require('precss'),
    require('autoprefix'),
  ],
}
