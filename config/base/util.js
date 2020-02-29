module.exports.resolveModule = function (str) {
  return require.resolve(str)
}
module.exports.webpackMerge = require('webpack-merge')