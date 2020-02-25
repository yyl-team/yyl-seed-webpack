const print = require('yyl-print')
const util = require('yyl-util')
const handler = require('./handler');

(() => {
  const ctrl = process.argv[2]
  const iEnv = util.envParse(process.argv.slice(3))

  if (ctrl in handler) {
    handler[ctrl](iEnv)
  } else {
    print.log.warn(`usage: ${Object.keys(handler).join(',')}`)
  }
})()


