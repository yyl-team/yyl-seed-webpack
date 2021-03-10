const { YylHander } = require('yyl-hander')
const seed = require('../')
const chalk = require('chalk')

const handler = {
  async all({ env = {}, logger }) {
    if (env.silent) {
      logger.setLogLevel(0)
    } else if (env.logLevel) {
      logger.setLogLevel(env.logLevel)
    }

    const yyHander = new YylHander({
      env,
      logger(type, $1, $2, $3) {
        if (type === 'msg') {
          logger.log($1, $2)
        } else if (type === 'progress') {
          logger.setProgress($1, $2, $3)
        }
      }
    })
    await yyHander.init({
      seed
    })
  },
  async watch({ env = {}, logger }) {
    if (env.silent) {
      logger.setLogLevel(0)
    } else if (env.logLevel) {
      logger.setLogLevel(env.logLevel)
    } 

    const yyHander = new YylHander({
      env,
      logger(type, $1, $2, $3) {
        if (type === 'msg') {
          logger.log($1, $2)
        } else if (type === 'progress') {
          logger.setProgress($1, $2, $3)
        }
      }
    })
    await yyHander.init({
      seed,
      watch: true
    })
  }
}
module.exports = handler
