const webpackMerge = require('webpack-merge')
const path = require('path')

const webpackDev = require('./webpack.dev.js')
const util = require('yyl-util')

const init = (config, iEnv) => {
  const resolveRoot = path.resolve(__dirname, config.alias.root)
  const webpackConfig = {
    output: {
      publicPath: util.path.join(
        config.commit.hostname,
        config.dest.basePath,
        path.relative(config.alias.root, resolveRoot),
        '/'
      )
    }
  }
  return webpackMerge(webpackDev(config, iEnv), webpackConfig)
}

module.exports = init
