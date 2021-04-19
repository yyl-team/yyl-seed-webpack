#!/usr/bin/env node
const YylCmdLogger = require('yyl-cmd-logger')
const chalk = require('chalk')
const util = require('yyl-util')
const handler = require('./handler')
const fs = require('fs')
const path = require('path')

const logger = new YylCmdLogger({
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
  const { env, cmds } = util.cmdParse(process.argv || [])

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

  const ctrl = cmds[0]
  logger.log('main', [`${cmds.join(' ')} ${util.envStringify(env)}`])
  if (ctrl in handler) {
    handler[ctrl]({ env, logger }).catch((er) => {
      logger.log('error', [er])
    })
  } else {
    logger.log('warn', [`usage: ${Object.keys(handler).join(',')}`])
  }
})()
