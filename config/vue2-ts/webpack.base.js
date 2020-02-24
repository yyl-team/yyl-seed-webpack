const VueLoaderPlugin = require('vue-loader/lib/plugin')

const path = require('path')
const { happyPackLoader } = require('../base/happypack')

const init = (config) => {
  const wConfig = {
    module: {
      rules: [{
        test: /\.vue$/,
        loader: require.resolve('vue-loader'),
        options: {
          loaders: {
            js: happyPackLoader('js')
          }
        }
      }]
    },
    resolve: {
      modules: [
        path.join( __dirname, 'node_modules')
      ],
      alias: Object.assign({
        'vue$': 'vue/dist/vue.esm.js',
        'vue': 'vue/dist/vue.esm.js'
      }, config.alias),
      extensions: ['.vue'],
      plugins: []
    },
    resolveLoader: {
      modules: [
        path.join( __dirname, 'node_modules')
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  }

  return wConfig
}

module.exports = init