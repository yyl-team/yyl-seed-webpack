const fs = require('fs')
const path = require('path')
const util = require('yyl-util')
const extFs = require('yyl-fs')
const print = require('yyl-print')
const extOs = require('yyl-os')
const tUtil = require('yyl-seed-test-util')
const Hander = require('yyl-hander')
const chalk = require('chalk')

const USERPROFILE = process.env[process.platform == 'win32'? 'USERPROFILE': 'HOME']
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
        extFs.copyFiles(config.resource).then(() => {
          next()
        })
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

    const opzer = seed.optimize(config, CONFIG_DIR)

    await fn.clearDest(config)

    return await util.makeAwait((next) => {
      opzer.all(iEnv)
        .on('msg', (...argv) => {
          const [type, iArgv] = argv
          let iType = type
          if (!print.log[type]) {
            iType = 'info'
          }
          print.log[iType](iArgv)
        })
        .on('clear', () => {
          print.cleanScreen()
        })
        .on('loading', (pkgName) => {
          print.log.loading(`loading module ${chalk.green(pkgName)}`)
        })
        .on('finished', async() => {
          await yh.optimize.afterTask()
          print.log.success('task finished')
          next()
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

    const opzer = seed.optimize(config, CONFIG_DIR)


    // 本地服务器
    await tUtil.server.start(config.alias.destRoot, config.localserver.port || 5000)

    opzer.initServerMiddleWare(tUtil.server.getAppSync(), iEnv)

    await fn.clearDest(config)

    return util.makeAwait((next) => {
      // let isUpdate = false
      opzer.watch(iEnv)
        .on('clear', () => {
          if (!iEnv.silent) {
            print.cleanScreen()
          }
        })
        .on('msg', (...argv) => {
          const [type, iArgv] = argv
          let iType = type
          if (!print.log[type]) {
            iType = 'info'
          }
          if (!iEnv.silent) {
            print.log[iType](iArgv)
          }
        })
        .on('finished', async() => {
          // if (!isUpdate) {
          //   await yh.optimize.afterTask()
          //   isUpdate = true
          // } else {
          //   await yh.optimize.afterTask(true)
          // }
          if (!iEnv.silent) {
            print.log.success('task finished')
          }
          next()
        })
    })
  },
  async abort() {
    return await tUtil.server.abort()
  }
}

module.exports = handler