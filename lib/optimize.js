const util = require('yyl-util')
const SeedResponse = require('yyl-seed-response')
const webpackMerge = require('webpack-merge')
const extOs = require('yyl-os')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const LANG = require('../lang/index')

let webpack = undefined

const USAGE = {
  watch: 'watch',
  all: 'all'
}

let iRes = null

const cache = {
  app: undefined
}

function requireWebpack (iRes) {
  if (!webpack) {
    iRes.trigger('msg', ['info', LANG.OPTIMIZE.LOADING_WEBPACK_START])
    webpack = require('webpack')
    iRes.trigger('msg', ['success', LANG.OPTIMIZE.LOADING_WEBPACK_FINISHED])
  }
  return webpack
}

const fn = {
  checkInstall(pkgName, pkgPath) {
    if (fs.existsSync(pkgPath)) {
      const pkg = require(pkgPath)
      return pkg.dependencies[pkgName] || pkg.devDependencies[pkgName]
    } else {
      return false
    }
  },
  envInit({ iEnv, yConfig }) {
    let rEnv
    if (typeof iEnv !== 'object') {
      rEnv = {}
    } else {
      rEnv = iEnv
    }

    if (rEnv.ver == 'remote') {
      rEnv.remote = true
    }
    if (rEnv.remote) {
      rEnv.ver = 'remote'
    }

    rEnv.staticRemotePath = (rEnv.remote || rEnv.isCommit || rEnv.proxy) ? (yConfig.commit.staticHost || yConfig.commit.hostname) : '/'
    rEnv.mainRemotePath = (rEnv.remote || rEnv.isCommit || rEnv.proxy) ? (yConfig.commit.mainHost || yConfig.commit.hostname) : '/'
    return rEnv
  },
  buildWConfig({ iEnv, ctx, yConfig, root }) {
    let iWconfig
    let wConfigPath
    let wConfigName
    const configRoot = path.join(__dirname, '../config')
    let wConfigProfixPath = path.join(configRoot, 'base')
    if (yConfig.seed) {
      wConfigProfixPath = path.join(configRoot, yConfig.seed)
      if (!fs.existsSync(wConfigProfixPath)) {
        throw new Error(`${LANG.OPTIMIZE.WCONFIG_TYPE_NOT_EXISTS}: ${yConfig.seed}`)
      }
    }

    if (iEnv.isCommit) {
      wConfigName = 'webpack.publish.js'
    } else if (iEnv.remote) {
      wConfigName = 'webpack.remote.js'
    } else if (iEnv.proxy) {
      wConfigName = 'webpack.proxy.js'
    } else {
      wConfigName = 'webpack.dev.js'
    }

    wConfigPath = path.join(wConfigProfixPath, wConfigName)

    iWconfig = require(wConfigPath)

    if (ctx === 'watch') {
      iEnv.useHotPlugin = true
      iEnv.hmr = true
    }
    if (root) { // 项目本地 config
      let wPath = util.path.join(root, 'webpack.config.js')

      // 配置中的 wConfig
      if (yConfig.webpackConfigPath) {
        wPath = util.path.resolve(root, yConfig.webpackConfigPath)
      }
      if (fs.existsSync(wPath)) {
        const pjWConfig = require(wPath)
        if (pjWConfig.devServer && iEnv.useHotPlugin) {
          iEnv.useHotPlugin = false
        }
        const bConfig = iWconfig(yConfig, iEnv)
        if (typeof pjWConfig === 'function') {
          return webpackMerge(bConfig, pjWConfig({ env: iEnv, config: yConfig }))
        } else {
          return webpackMerge(bConfig, pjWConfig)
        }
      } else {
        return iWconfig(yConfig, iEnv)
      }
    } else {
      return iWconfig(yConfig, iEnv)
    }
  },
  webpackFinishedHandle(iRes, iEnv, done) {
    return (err, stats) => {
      if (err) {
        iRes.trigger('msg', ['error', err])
      } else {
        iRes.trigger('msg', ['success', LANG.OPTIMIZE.WEBPACK_RUN_SUCCESS])

        if (iEnv.logLevel == 2) {
          // eslint-disable-next-line no-console
          console.log(stats.toString({
            chunks: false,  // 使构建过程更静默无输出
            colors: true    // 在控制台展示颜色
          }))
        } else {
          iRes.trigger('msg', ['info', stats.toString()])
        }

        const compilation = stats.compilation
        const basePath = compilation.outputOptions.path

        Object.keys(compilation.assets).forEach((key) => {
          const iPath = util.path.join(basePath, key)
          iRes.trigger('msg', [fs.existsSync(iPath) ? 'update': 'create', iPath])
        })
        compilation.errors.forEach((err) => {
          iRes.trigger('msg', ['error', err.message || err.details || err])
        })
        compilation.warnings.forEach((warn) => {
          iRes.trigger('msg', ['warn', warn.details])
        })
      }
      iRes.trigger('finished', [])
      return done && done()
    }
  }
}

const task = {
  async preCheck ({ iEnv, iRes, yConfig, root }) {
    if (!root) {
      return
    }
    // + 版本校验
    // 检查是否存在 package.json

    const pkgPath = util.path.join(root, 'package.json')
    if (fs.existsSync(pkgPath)) {
      iRes.trigger('msg', ['info', LANG.OPTIMIZE.CHECK_SEED_PKG_START])
      await extOs.installPackage(pkgPath, {
        production: true,
        loglevel: iEnv.silent ? 'silent' : 'info'
      })
      iRes.trigger('msg', ['success', LANG.OPTIMIZE.CHECK_SEED_PKG_FINISHED])
    }

    // 检查 seed 包 package.json 是否已经初始化
    if (!yConfig.seed) {
      throw new Error(LANG.OPTIMIZE.SEED_NOT_SET)
    }
    if (yConfig.seed) {
      const seedDir = path.join(__dirname, '../config', yConfig.seed)
      if (fs.existsSync(seedDir)) {
        const pkgPath = path.join(seedDir, 'package.json')
        if (fs.existsSync(pkgPath)) {
          iRes.trigger('msg', ['info', LANG.OPTIMIZE.CHECK_TARGET_PKG_START])
          await extOs.installPackage(pkgPath, {
            loglevel: iEnv.silent ? 'silent' : 'info'
          })
          iRes.trigger('msg', ['success', LANG.OPTIMIZE.CHECK_TARGET_PKG_FINISHED])
        }
      } else {
        throw new Error(`${LANG.OPTIMIZE.SEED_NOT_EXISTS}: ${yConfig.seed}`)
      }
    }
    // - 版本校验
  },
  all({ iEnv, config, yConfig, root }) {
    const iRes = new SeedResponse()
    iRes.trigger('clear', [])

    task.preCheck({ iEnv, iRes, yConfig, root }).then(() => {
      requireWebpack(iRes)
      const compiler = webpack(config)

      iRes.trigger('start', ['watch'])
      iRes.trigger('msg', ['info', LANG.OPTIMIZE.WEBPACK_RUN_START])
      compiler.run(fn.webpackFinishedHandle(iRes, iEnv))
    })

    return iRes
  },
  watch({ iEnv, config, yConfig, root }) {
    const iRes = new SeedResponse()

    iRes.trigger('clear', [])
    task.preCheck({ iEnv, iRes, yConfig, root }).then(() => {
      requireWebpack(iRes)
      const compiler = webpack(config)

      compiler.hooks.beforeCompile.tapPromise('beforeCompile', async () => {
        iRes.trigger('clear', [])
        iRes.trigger('start', ['watch'])
        iRes.trigger('msg', ['info', LANG.OPTIMIZE.WEBPACK_RUN_START])
      })

      const devOption = {
        noInfo: +iEnv.logLevel === 2 ? false : true, /* debug*/
        publicPath: config.output.publicPath,
        writeToDisk: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        reporter(middlewareOptions, options) {
          let stats = null
          if (options && options.stats && options.state !== false) {
            stats = options.stats
          }


          if (stats) {
            fn.webpackFinishedHandle(iRes, iEnv)(null, stats)
          }
        },
        watchOptions: {
          aggregateTimeout: 1000
        }
      }

      if (config.devServer) { // 配置了 devServer
        iRes.trigger('msg', ['info', LANG.OPTIMIZE.USE_DEV_SERVER])
        const pkgPath = path.join(yConfig.alias.dirname, 'package.json')

        const needInstalls = []
        if (!fn.checkInstall('webpack', pkgPath)) {
          needInstalls.push('webpack')
        }

        if (!fn.checkInstall('webpack-dev-server', pkgPath))  {
          needInstalls.push('webpack-dev-server')
        }
        if (needInstalls.length) {
          iRes.trigger('msg', [
            'error',
            `${LANG.OPTIMIZE.WEBPACK_DEV_SERVER_NEED_PRE_INSTALL}: ${needInstalls.map(name => chalk.yellow(name)).join(', ')}`,
            `${chalk.yellow(`npm i ${needInstalls.join(' ')} -D`)}`
          ])
          return
        }

        const DevServer = require('webpack-dev-server')
        const serverOption = Object.assign(devOption, {
          disableHostCheck: true,
          contentBase: path.resolve(root, yConfig.localserver.root),
          compress: true,
          port: yConfig.localserver.port,
          before(app) {
            if (config.devServer.historyApiFallback) {
              /**
               * 由于 proxy 后通过域名访问 404 页面无法正确重定向， 
               * 通过 添加 header.accept, 跳过 historyApiFallback 前置校验
               *  */
              app.use((req, res, next) => {
                if (
                  req.method === 'GET' &&
                  [''].indexOf(path.extname(req.url)) !== -1 &&
                  req.headers
                ) {
                  req.headers.accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
                }
                next()
              })
            }
          },
          inline: true,
          hot: true,
          host: '0.0.0.0',
          sockHost: '127.0.0.1',
          serveIndex: true
        }, config.devServer)
        const devServer = new DevServer(compiler, serverOption)
        devServer.listen(yConfig.localserver.port, (err) => {
          if (err) {
            iRes.trigger('msg', ['error', LANG.OPTIMIZE.DEV_SERVER_START_FAIL, err])
          } else {
            iRes.trigger('msg', ['success', LANG.OPTIMIZE.DEV_SERVER_START_SUCCESS])
          }
        })
      } else if (cache.app) { // 没配置 devServer
        iRes.trigger('msg', ['info', LANG.OPTIMIZE.USE_MIDDLEWARE])
        let devMiddleware = null
        let hotMiddleware = null

        devMiddleware = require('webpack-dev-middleware')
        hotMiddleware = require('webpack-hot-middleware')

        cache.app.use(devMiddleware(compiler, devOption))

        cache.app.use(hotMiddleware(compiler, {
          publicPath: config.output.publicPath,
          log: false
        }))
      } else {
        compiler.watch({
          aggregateTimeout: 1000
        }, fn.webpackFinishedHandle(iRes, iEnv))
      }
    })

    return iRes
  }
}

const wOpzer = function ({ config, root, iEnv, ctx }) {
  const yConfig = util.extend(true, {}, config)
  iEnv = fn.envInit({ iEnv, yConfig })
  const wConfig = fn.buildWConfig({ iEnv, ctx, yConfig, root })

  const opzer = {}

  if (wConfig.devServer) {
    opzer.ignoreServer = true
  }

  Object.keys(USAGE).forEach((key) => {
    opzer[key] = function() {
      return task[key]({ iEnv, config: wConfig, yConfig, root })
    }
  })

  opzer.getConfigSync = function() {
    return yConfig
  }

  opzer.response = iRes

  opzer.root = root

  opzer.ignoreLiveReload = true

  opzer.initServerMiddleWare = function (app) {
    cache.app = app
  }

  return opzer
}

wOpzer.handles = Object.keys(USAGE)
wOpzer.withServer = true

module.exports = wOpzer
