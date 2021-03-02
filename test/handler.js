const { YylHander } = require('yyl-hander')
const seed = require('../')
const chalk = require('chalk')



const handler = {
  async all({ env = {}, logger }) {
    if (env.silent) {
      logger.setLogLevel(0)
    } else {
      // logger.setLogLevel(2)
    }

    const yyHander = new YylHander({
      env,
      logger(type, subType, args) {
        if (type === 'msg') {
          logger.log(subType, args)
        } else if (type === 'progress') {
          logger.setProgress(subType)
        }
      }
    })
    await yyHander.init({
      seed
    })
  }
}
module.exports = handler
