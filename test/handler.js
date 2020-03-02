const fs = require('fs')
const path = require('path')
const util = require('yyl-util')
const extFs = require('yyl-fs')
const print = require('yyl-print')
const extOs = require('yyl-os')
const tUtil = require('yyl-seed-test-util')
const Hander = require('yyl-hander')
const { Runner } = require('yyl-server')
const chalk = require('chalk')

const USERPROFILE = process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']
const RESOLVE_PATH = path.join(USERPROFILE, '.yyl/plugins/webpack')
const WORKFLOW = 'webpack'

const seed = require('../index.js')
const yh = new Hander({
  log: function (type, status, args) {
    switch (type) {
    case 'msg':
      if (print.log[status]) {
        print.log[status](args)
      } else {
        print.log.info(args)
      }
      break

    default:
      break
    }
  },
  vars: {
    PROJECT_PATH: process.cwd()
  }
})

let config = {}

print.log.init({
  maxSize: 8,
  type: {
    rev: {name: 'rev', color: 'yellow', bgColor: 'bgBlack'},
    concat: {name: 'Concat', color: 'cyan', bgColor: 'bgBlue'},
    update: {name: 'Updated', color: 'cyan', bgColor: 'bgBlue'},
    optimize: {name: 'Optimize', color: 'green', bgColor: 'bgRed'},
    cmd: {name: 'CMD', color: 'gray', bgColor: 'bgBlack'},
    loading: {name: 'LOAD', color: chalk.bgGreen.white}
  }
})

const fn = {
  clearDest() {
    return new Promise((next) => {
      extFs.removeFiles(config.alias.destRoot).then(() => {
        next()
      })
    })
  },
  async initPlugins(config) {
    if (config.plugins && config.plugins.length) {
      if (!fs.existsSync(RESOLVE_PATH)) {
        extFs.mkdirSync(RESOLVE_PATH)
      }
      await tUtil.initPlugins(config.plugins, RESOLVE_PATH)
    }
    return config
  }
}

const cache = {}

const handler = {
  async all(iEnv) {
    let configPath
    if (iEnv.silent) {
      print.log.setLogLevel(0)
    } else {
      print.log.setLogLevel(2)
    }

    if (iEnv.config) {
      configPath = path.resolve(process.cwd(), iEnv.config)
      if (!fs.existsSync(configPath)) {
        return print.log.warn(`config path not exists: ${configPath}`)
      } else {
        iEnv.workflow = WORKFLOW
        const configDir = path.dirname(configPath)
        if (!fs.existsSync(path.join(configDir, 'node_modules'))) {
          print.log.info('start install package')
          await extOs.runCMD('npm i ', configDir)
        } else {
          print.log.info('package exists')
        }
        config = await yh.parseConfig(configPath, iEnv)
      }
    } else {
      return print.log.warn('task need --config options')
    }

    const CONFIG_DIR = path.dirname(configPath)
    yh.setVars({
      PROJECT_PATH: CONFIG_DIR
    })

    yh.optimize.init({config, iEnv})
    await yh.optimize.initPlugins()

    let opzer
    try {
      opzer = seed.optimize({config, iEnv, ctx: 'all', root: CONFIG_DIR})
    } catch (er) {
      print.log.error(er.message)
      return
    }

    await fn.clearDest(config)

    return await util.makeAwait((next) => {
      let hasError = false
      opzer.all(iEnv)
        .on('msg', (type, ...argv) => {
          let iType = type
          if (!print.log[type]) {
            iType = 'info'
          }
          if (type === 'error')  {
            hasError = argv
          }
          print.log[iType](...argv)
        })
        .on('clear', () => {
          // print.cleanScreen()
        })
        .on('loading', (pkgName) => {
          print.log.loading(`loading module ${chalk.green(pkgName)}`)
        })
        .on('finished', async() => {
          if (hasError) {
            print.log.error('task run error', hasError)
          } else {
            print.log.success('task finished')
          }
          next(config)
        })
    })
  },
  async watch(iEnv) {
    let configPath
    if (iEnv.silent) {
      print.log.setLogLevel(0)
    } else {
      print.log.setLogLevel(2)
    }
    if (iEnv.config) {
      configPath = path.resolve(process.cwd(), iEnv.config)
      if (!fs.existsSync(configPath)) {
        return print.log.warn(`config path not exists: ${configPath}`)
      } else {
        iEnv.workflow = WORKFLOW
        const configDir = path.dirname(configPath)
        if (!fs.existsSync(path.join(configDir, 'node_moduels'))) {
          await extOs.runCMD('npm i ', configDir)
        }
        config = await yh.parseConfig(configPath, iEnv)
      }
    } else {
      return print.log.warn('task need --config options')
    }

    const CONFIG_DIR = path.dirname(configPath)
    yh.setVars({
      PROJECT_PATH: CONFIG_DIR
    })

    yh.optimize.init({config, iEnv})
    await yh.optimize.initPlugins()

    const opzer = seed.optimize({config, iEnv, ctx: 'watch', root: CONFIG_DIR})

    cache.runner = new Runner({
      config,
      env: iEnv,
      cwd: iEnv.config ? path.dirname(iEnv.config) : CONFIG_DIR,
      ignoreServer: opzer.ignoreServer,
      log(status, args) {
        if (print.log[status]) {
          print.log[status](...args)
        } else {
          print.log.info(...args)
        }
      }
    })

    await cache.runner.start()

    if (!opzer.ignoreServer) {
      if (opzer.initServerMiddleWare) {
        opzer.initServerMiddleWare(cache.runner.app, iEnv)
      }
    }

    await fn.clearDest(config)

    return util.makeAwait((next) => {
      let isUpdate = false
      opzer.watch(iEnv)
        .on('clear', () => {
          if (!iEnv.silent) {
            // print.cleanScreen()
          }
        })
        .on('msg', (type, ...argv) => {
          let iType = type
          if (!print.log[type]) {
            iType = 'info'
          }
          if (!iEnv.silent) {
            print.log[iType](...argv)
          }
        })
        .on('finished', async() => {
          const homePage = await yh.optimize.getHomePage()
          print.log.success(`open homepage: ${homePage}`)
          // 第一次构建 打开 对应页面
          if (!isUpdate && !iEnv.silent && iEnv.proxy) {
            extOs.openBrowser(homePage)
          }

          if (isUpdate) {
            // 刷新页面
            if (!opzer.ignoreLiveReload || iEnv.livereload) {
              print.log.success('刷个新')
              await yh.optimize.livereload()
            }
            print.log.success('finished')
          } else {
            isUpdate = 1
            print.log.success('finished')
            next(config, opzer)
          }
        })
    })
  },
  async abort() {
    if (cache.runner) {
      await cache.runner.abort()
    }
  }
}

module.exports = handler