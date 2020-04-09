'use strict'
const path = require('path')
const fs = require('fs')
const webpackMerge = require('webpack-merge')
const webpack = require('webpack')
const extOs = require('yyl-os')

const es3ifyWebpackPlugin = require('es3ify-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const util = require('yyl-util')

const YylConcatWebpackPlugin = require('yyl-concat-webpack-plugin')
const YylCopyWebpackPlugin = require('yyl-copy-webpack-plugin')
const YylSugarWebpackPlugin = require('yyl-sugar-webpack-plugin')
const YylRevWebpackPlugin = require('yyl-rev-webpack-plugin')
const YylEnvPopPlugin = require('yyl-env-pop-webpack-plugin')

const { resolveModule } = require('./util')

const webpackBaseEntry = require('./webpack.base.entry')
const webpackBaseModule = require('./webpack.base.module')

const init = (config, iEnv) => {
  const resolveRoot = path.resolve(__dirname, config.alias.root)

  const wConfig = {
    context: path.resolve(__dirname, config.alias.dirname),
    output: {
      path: resolveRoot,
      filename: util.path.relative(
        resolveRoot,
        path.join(config.alias.jsDest, '[name]-[hash:8].js')
      ),
      chunkFilename: util.path.relative(
        resolveRoot,
        path.join(
          config.alias.jsDest,
          'async_component/[name]-[chunkhash:8].js'
        )
      )
    },
    resolveLoader: {
      modules: [path.join(config.alias.dirname, 'node_modules')]
    },
    resolve: {
      modules: [path.join(config.alias.dirname, 'node_modules')],
      alias: util.extend(
        {
          'webpack-hot-middleware/client': resolveModule(
            'webpack-hot-middleware/client.js'
          ),
          'ansi-html': resolveModule('ansi-html'),
          'html-entities': resolveModule('html-entities'),
          'strip-ansi': resolveModule('strip-ansi'),
          'ansi-regex': resolveModule('ansi-regex'),
          'isarray': resolveModule('isarray')
        },
        config.alias
      )
    },
    devtool: 'source-map',
    plugins: [],
    optimization: {
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            ie8: config.ie8 ? true : false,
            keep_fnames: config.keep_fnames ? true : false
          }
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  }

  // hot reload
  if (!config.ie8 && iEnv.useHotPlugin) {
    wConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  // providePlugin
  if (config.providePlugin) {
    wConfig.plugins.push(new webpack.ProvidePlugin(config.providePlugin))
  }

  // env defined
  // 环境变量 (全局替换 含有这 变量的 js)
  wConfig.plugins.push(
    (() => {
      const r = {}
      Object.keys(iEnv).forEach((key) => {
        if (typeof iEnv[key] === 'string') {
          r[`process.env.${key}`] = JSON.stringify(iEnv[key])
        } else {
          r[`process.env.${key}`] = iEnv[key]
        }
      })

      return new webpack.DefinePlugin(r)
    })()
  )

  // ie8 格式化
  if (config.ie8) {
    wConfig.plugins = wConfig.plugins.concat([new es3ifyWebpackPlugin()])
  }

  // config.module 继承
  if (config.moduleRules) {
    wConfig.module.rules = wConfig.module.rules.concat(config.moduleRules)
  }

  // extend node_modules
  if (config.resolveModule) {
    wConfig.resolve.modules.unshift(config.resolveModule)
    wConfig.resolveLoader.modules.unshift(config.resolveModule)
  }

  // add seed node_modules
  if (config.seed) {
    const nodeModulePath = path.join(
      __dirname,
      '../',
      config.seed,
      'node_modules'
    )
    if (fs.existsSync(nodeModulePath)) {
      wConfig.resolve.modules.unshift(nodeModulePath)
      wConfig.resolveLoader.modules.unshift(nodeModulePath)
    }
  }

  // 添加 yyl 脚本， 没有挂 hooks 所以放最后比较稳
  wConfig.plugins = wConfig.plugins.concat([
    // pop
    new YylEnvPopPlugin({
      enable: iEnv.tips,
      text: `${iEnv.remote ? 'REMOTEING' : 'PROXYING'}: ${extOs.LOCAL_IP}`,
      duration: 3000
    }),
    // config.concat
    new YylConcatWebpackPlugin({
      fileMap: config.concat || {},
      filename: '[name]-[hash:8].[ext]',
      logBasePath: config.alias.dirname,
      minify: iEnv.isCommit ? true : false
    }),
    // config.resource
    new YylCopyWebpackPlugin(
      (() => {
        const r = {
          files: [],
          minify: false,
          logBasePath: config.alias.dirname
        }
        if (config.resource) {
          Object.keys(config.resource).forEach((from) => {
            const iExt = path.extname(from)
            if (iExt) {
              if (['.html'].indexOf(iExt) !== -1) {
                r.files.push({
                  from,
                  to: config.resource[from],
                  filename: '[name].[ext]'
                })
              } else {
                r.files.push({
                  from,
                  to: config.resource[from],
                  filename: '[name]-[hash:8].[ext]'
                })
              }
            } else {
              r.files.push({
                from,
                to: config.resource[from],
                matcher: ['*.html', '!**/.*'],
                filename: '[name].[ext]'
              })

              r.files.push({
                from,
                to: config.resource[from],
                matcher: ['!*.html', '!**/.*'],
                filename: '[name]-[hash:8].[ext]'
              })
            }
          })
        }
        return r
      })()
    ),
    // {$alias}
    new YylSugarWebpackPlugin({}),
    // rev
    new YylRevWebpackPlugin({
      filename: util.path.join(
        path.relative(resolveRoot, config.alias.revDest),
        'rev-manifest.json'
      ),
      revRoot: config.alias.revRoot,
      remote: iEnv.remote,
      remoteAddr: config.commit.revAddr,
      remoteBlankCss: iEnv.isCommit ? false : true,
      extends: (() => {
        const r = {
          version: util.makeCssJsDate(),
          staticRemotePath: config.commit.staticHost || config.commit.hostname,
          mainRemotePath: config.commit.mainHost || config.commit.hostname
        }
        Object.keys(iEnv)
          .filter((key) => {
            return (
              [
                'isCommit',
                'logLevel',
                'proxy',
                'name',
                'config',
                'workflow',
                'useHotPlugin',
                'hmr'
              ].indexOf(key) === -1
            )
          })
          .forEach((key) => {
            r[key] = iEnv[key]
          })
        return r
      })()
    })
  ])

  return webpackMerge(
    webpackBaseEntry(config, iEnv),
    webpackBaseModule(config, iEnv),
    wConfig
  )
}

module.exports = init
