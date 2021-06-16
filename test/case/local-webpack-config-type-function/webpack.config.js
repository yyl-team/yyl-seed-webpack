const VConsolePlugin = require('vconsole-webpack-plugin')
const wConfig = function ({ env, yylConfig }) {
  return {
    plugins: [
      new VConsolePlugin({
        enable: true
      })
    ]
  }
}

module.exports = wConfig
