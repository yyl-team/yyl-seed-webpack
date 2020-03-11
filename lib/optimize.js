const util = require('yyl-util')
const SeedResponse = require('yyl-seed-response')
const webpackMerge = require('webpack-merge')
const extOs = require('yyl-os')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const LANG = require('../lang/index')

let webpack = require('webpack')

const USAGE = {
  watch: 'watch',
  all: 'all',
  o: 'o',
  w: 'w',
  d: 'd',
  r: 'r'
}

const cache = {
  app: undefined
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

    if (ctx === 'watch' && (iEnv.hmr || iEnv.livereload)) {
      iEnv.useHotPlugin = true
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
  }
}

const task = {
  initCompilerLog({ compiler, iRes, iEnv }) {
    const { output } = compiler.options
    const logCache = {}
    const compilationLogIt = (compilation) => {
      compilation.chunks.forEach((chunk) => {
        chunk.files.forEach((fName) => {
          const iPath = util.path.resolve(output.path, fName)
          if (!logCache[iPath]) {
            iRes.trigger('msg', ['create', iPath])
            logCache[iPath] = true
          }
        })
      })
      const stats = compilation.getStats().toJson({
        all: false,
        assets: true
      })
      stats.assets.forEach((asset) => {
        const iPath = util.path.resolve(output.path, asset.name)
        if (!logCache[iPath]) {
          iRes.trigger('msg', ['create', iPath])
          logCache[iPath] = true
        }
      })
    }
    compiler.hooks.afterCompile.tap('yyl-seed', compilationLogIt)
    compiler.hooks.emit.tap('yyl-seed', compilationLogIt)

    // 完成回调
    compiler.hooks.done.tap('yyl-seed', (stats) => {
      const statsInfo = stats.toJson({
        all: false,
        assets: true,
        errors: true,
        warnings: true,
        logging: 'warn'
      })
      const logStr = stats.toString({
        chunks: false,  // 使构建过程更静默无输出
        colors: true    // 在控制台展示颜色
      })

      iRes.trigger(
        'msg',
        ['info'].concat(
          logStr.split(/[\r\n]+/).map((str) => str.trim().replace(/\s+/g, ' '))
        )
      )

      statsInfo.warnings.forEach((er) => {
        iRes.trigger('msg', ['warn', iEnv.logLevel === 2 ? er : er.message || er])
      })

      statsInfo.errors.forEach((er) => {
        iRes.trigger('msg', ['error', iEnv.logLevel === 2 ? er : er.message || er])
      })

      if (statsInfo.logging) {
        Object.keys(statsInfo.logging).forEach((pluginName) => {
          const { entries } = statsInfo.logging[pluginName]
          if (entries && entries.length) {
            entries.forEach((logInfo) => {
              if (logInfo.type === 'warn') {
                iRes.trigger('msg', ['warn', pluginName, logInfo.message])
              } else if (logInfo.type === 'error') {
                iRes.trigger('msg', ['error', pluginName, logInfo.message])
              }
            })
          }
        })
      }

      iRes.trigger('finished', [])
    })

    // watch 开始回调
  },
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

    // 老版本兼容
    if (yConfig.workflow === 'webpack-vue2') {
      yConfig.workflow = 'webpack'
      yConfig.seed = 'vue2'
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
  all({ iEnv, config, iRes }) {
    const compiler = webpack(config)

    iRes.trigger('start', ['watch'])
    iRes.trigger('msg', ['info', LANG.OPTIMIZE.WEBPACK_RUN_START])

    compiler.run()

    this.initCompilerLog({ compiler, iRes, iEnv })

    return iRes
  },
  watch({ iEnv, config, yConfig, root, iRes }) {
    const compiler = webpack(config)
    const noInfo = +iEnv.logLevel === 2 ? false : true

    compiler.hooks.watchRun.tap('yyl-seed', () => {
      iRes.trigger('clear', [])
      iRes.trigger('start', ['watch'])
      iRes.trigger('msg', ['info', LANG.OPTIMIZE.WEBPACK_RUN_START])
      iRes.trigger('msg', ['info', iEnv.livereload ? LANG.OPTIMIZE.USE_LIVERELOAD : LANG.OPTIMIZE.USE_HMR])
    })

    this.initCompilerLog({ compiler, iRes, iEnv })

    const devOption = {
      noInfo,
      reporter() {},
      publicPath: config.output.publicPath,
      writeToDisk: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
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
        hot: iEnv.hmr ? true : false,
        livereload: iEnv.livereload,
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
      cache.app.use(devMiddleware(compiler, devOption))

      if (iEnv.hmr || iEnv.livereload) {
        hotMiddleware = require('webpack-hot-middleware')
        cache.app.use(hotMiddleware(compiler, {
          publicPath: config.output.publicPath,
          reload: iEnv.livereload ? true : false,
          log: false
        }))
      }
    } else {
      compiler.watch({
        aggregateTimeout: 1000
      })
    }

    return iRes
  }
}

const wOpzer = async function ({ config, root, iEnv, ctx }) {
  const yConfig = util.extend(true, {}, config)
  const iRes = new SeedResponse()
  iEnv = fn.envInit({ iEnv, yConfig })

  await task.preCheck({ iEnv, iRes, yConfig, root })
  const wConfig = fn.buildWConfig({ iEnv, ctx, yConfig, root })

  const opzer = {}

  if (wConfig.devServer) {
    opzer.ignoreServer = true
  }

  Object.keys(USAGE).forEach((key) => {
    opzer[key] = function() {
      return task[key]({ iEnv, config: wConfig, yConfig, root, iRes, ctx })
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

  opzer.on = function (...args) {
    iRes.on(...args)
    return opzer
  }

  return opzer
}

wOpzer.handles = Object.keys(USAGE)
wOpzer.withServer = true

module.exports = wOpzer
