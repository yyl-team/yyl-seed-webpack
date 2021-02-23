const print = require('yyl-print')
const util = require('yyl-util')
const handler = require('./handler')

;(() => {
  const { env, cmds } = util.cmdParse(process.argv)
  const ctrl = cmds[0]
  if (ctrl in handler) {
    if (env.ctx) {
      const ctx = env.ctx
      delete env.ctx
      handler[ctrl]({ env, ctx })
    } else {
      handler[ctrl]({ env })
    }
  } else {
    print.log.warn(`usage: ${Object.keys(handler).join(',')}`)
  }
})()
