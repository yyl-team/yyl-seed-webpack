const { webpackMerge } = require('../base/util')
const webpackBase = require('../base/webpack.dev')

const init = (config, iEnv) => {
  return webpackMerge(
    webpackBase(config, iEnv)
  )
}
module.exports = init