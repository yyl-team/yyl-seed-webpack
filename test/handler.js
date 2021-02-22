const { YylHander } = require('yyl-hander')
const print = require('yyl-print')
const seed = require('../')
const chalk = require('chalk')

print.log.init({
  maxSize: 8,
  mode0: {
    allowTypes: ['error', 'warn']
  },
  type: {
    update: { name: 'Updated', color: 'cyan', bgColor: 'bgBlue' },
    create: { name: 'ADD', color: 'cyan', bgColor: 'bgBlue' },
    optimize: { name: 'Optimize', color: 'green', bgColor: 'bgRed' },
    cmd: { name: 'CMD', color: 'gray', bgColor: 'bgBlack' },
    loading: { name: 'LOAD', color: chalk.bgGreen.white }
  }
})

const logger = (type, ctx, ext) => {
  switch (type) {
    case 'msg':
      if (ctx in print.log) {
        print.log[ctx](...ext)
      } else {
        print.log.info(...ext)
      }
      break
    case 'start':
      print.log.info('task start')
      break
    case 'finished':
      print.log.success('task finished')
      break
    case 'cmd':
      print.log.cmd(ext)
      break
  }
}

const handler = {
  async all ({ env = {} }) {
    if (env.silent) {
      print.log.setLogLevel(0)
    } else {
      print.log.setLogLevel(2)
    }
    
    const yyHander = new YylHander({
      env,
      logger
    })
    await yyHander.init({
      seed
    })
  }
}
module.exports = handler
