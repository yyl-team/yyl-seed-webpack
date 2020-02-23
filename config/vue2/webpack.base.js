const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { HappyPack, happyPackLoader } = require('../base/happypack')
const path = require('path')


const init = (config) => {
  const webpackConfig = {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: happyPackLoader('vue')
        }
      ]
    },
    resolve: {
      modules: [
        path.join( __dirname, 'node_modules')
      ],
      alias: {
        'actions': path.join(config.alias.srcRoot, 'vuex/actions.js'),
        'getters': path.join(config.alias.srcRoot, 'vuex/getters.js'),
        'vue$': 'vue/dist/vue.common.js',
        'setimmediate': require.resolve('setimmediate')
      }
    },
    resolveLoader: {
      modules: [
        path.join( __dirname, 'node_modules')
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HappyPack({
        id: 'vue',
        loaders: [path.resolve('vue-loader')]
      })
    ]
  }

  return webpackConfig
}

module.exports = init