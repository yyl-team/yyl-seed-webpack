const VConsolePlugin = require('vconsole-webpack-plugin')
const wConfig = function ({ env, config }) {
  return {
    plugins: [
      new VConsolePlugin({
        enable: env.mode !== 'master' && config.seed === 'base'
      })
    ]
  }
}

module.exports = wConfig
