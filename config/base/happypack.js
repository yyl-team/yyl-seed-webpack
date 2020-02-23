module.exports.HappyPack = require('happypack')
module.exports.happyPackLoader = function (id) {
  return `${require.resolve('happypack/loader')}?id=${id}`
}