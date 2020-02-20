const webpackMerge = require('webpack-merge')
const webpackPublish = require('./webpack.publish.js')

const init = (config, iEnv) => {
  const MODE = iEnv.NODE_ENV || 'development'
  const webpackConfig = {
    mode: MODE
  }
  return webpackMerge(webpackPublish(config, iEnv), webpackConfig)
}

module.exports = init
