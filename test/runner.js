const YylCmdLogger = require('yyl-cmd-logger')
const util = require('yyl-util')
const handler = require('../bin/handler')
const chalk = require('chalk')
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
  const { env, cmds } = util.cmdParse(process.argv)
  const ctrl = cmds[0]
  logger.log('main', ['runner'])
  if (ctrl in handler) {
    if (env.ctx) {
      const ctx = env.ctx
      delete env.ctx
      handler[ctrl]({ env, ctx, logger })
    } else {
      handler[ctrl]({ env, logger })
    }
  } else {
    logger.log('msg', 'warn', [`usage: ${Object.keys(handler).join(',')}`])
  }
})()
