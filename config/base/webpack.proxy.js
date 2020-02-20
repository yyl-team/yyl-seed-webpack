const webpackMerge = require('webpack-merge')
const path = require('path')

const webpackDev = require('./webpack.dev.js')
const util = require('yyl-util')

const init = (config, iEnv) => {
  const webpackConfig = {
    output: {
      publicPath: util.path.join(
        config.commit.hostname,
        config.dest.basePath,
        path.relative(
          config.alias.root,
          config.alias.jsDest
        ),
        '/'
      )
    }
  }
  return webpackMerge(
    webpackDev(config, iEnv),
    webpackConfig
  )
}

module.exports = init
