#!/usr/bin/env node
const { YylCmdLogger, cleanScreen } = require('yyl-cmd-logger')
const chalk = require('chalk')
const util = require('yyl-util')
const handler = require('./handler')
const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')

const logger = new YylCmdLogger({
  lite: true,
  type: {
    main: {
      name: 'SEED',
      color: chalk.bgRed.white,
      shortName: 'S',
      shortColor: chalk.red
    }
  }
})

;(() => {
  cleanScreen()
  let { env, cmds, shortEnv } = util.cmdParse(process.argv || [])

  if (env.version || shortEnv.v) {
    console.log(`${chalk.cyan(pkg.name)} ${chalk.yellow(pkg.version)}`)
    return
  }

  if (env.path || shortEnv.p) {
    console.log(`path: ${chalk.yellow(path.join(__dirname, '..'))}`)
    return
  }

  // + yyl config
  const context = process.cwd()
  const configPath = path.join(context, 'config.js')
  const yylConfigPath = path.join(context, 'yyl.config.js')

  if (fs.existsSync(configPath)) {
    env.config = configPath
  }
  if (fs.existsSync(yylConfigPath)) {
    env.config = yylConfigPath
  }
  // - yyl config

  let ctrl = cmds[0]
  if (ctrl === 'd') {
    cmds[0] = ctrl = 'watch'
    env = {
      proxy: true,
      tips: true,
      hmr: true,
      open: true,
      ...env
    }
  } else if (ctrl === 'e') {
    cmds[0] = ctrl = 'watch'
    env = {
      proxy: true,
      tips: true,
      hmr: true,
      open: true,
      esbuild: true,
      ...env
    }
  } else if (ctrl === 'w') {
    cmds[0] = ctrl = 'watch'
  } else if (ctrl === 'o') {
    cmds[0] = ctrl = 'all'
    env = {
      isCommit: true,
      ...env
    }
  } else if (ctrl === 'r') {
    cmds[0] = ctrl = 'watch'
    env = {
      proxy: true,
      tips: true,
      hmr: true,
      remote: true,
      ...env
    }
  }
  logger.log('main', [`yylw ${cmds.join(' ')} ${util.envStringify(env)}`])
  if (ctrl in handler) {
    handler[ctrl]({ env, logger }).catch((er) => {
      logger.log('error', [er])
      logger.setProgress('forceFinished', [])
    })
  } else {
    logger.log('warn', [`usage: ${Object.keys(handler).join(',')}`])
  }
})()
