const print = require('yyl-print')
const util = require('yyl-util')
const handler = require('./handler');

(() => {
  const { env, cmds } = util.cmdParse(process.argv)

  const ctrl = cmds[1]
  if (ctrl in handler) {
    handler[ctrl](env)
  } else {
    print.log.warn(`usage: ${Object.keys(handler).join(',')}`)
  }
})()


