const resolveModule = function (str) {
  return require.resolve(str)
}
const webpackMerge = require('webpack-merge')

module.exports = {
  resolveModule,
  webpackMerge
}