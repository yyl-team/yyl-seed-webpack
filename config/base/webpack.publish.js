const webpackMerge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')

const webpackBase = require('./webpack.base.js')
const util = require('yyl-util')

const init = (config, iEnv) => {
  const MODE = iEnv.NODE_ENV || 'production'
  const resolveRoot = path.resolve(__dirname, config.alias.root)

  const webpackConfig = {
    mode: MODE,
    output: {
      publicPath: util.path.join(
        config.commit.hostname,
        config.dest.basePath,
        path.relative(config.alias.root, resolveRoot),
        '/'
      )
    },
    devtool: false,
    plugins: [
      // 环境变量 (全局替换 含有这 变量的 js)
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(MODE)
      })
    ]
  }
  return webpackMerge(webpackBase(config, iEnv), webpackConfig)
}

module.exports = init
