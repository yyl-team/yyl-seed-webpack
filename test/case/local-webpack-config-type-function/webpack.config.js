const VConsolePlugin = require('vconsole-webpack-plugin')
const wConfig = function ({ env, yylConfig }) {
  return {
    plugins: [
      new VConsolePlugin({
        enable: env.mode !== 'master'
      })
    ]
  }
}

module.exports = wConfig
