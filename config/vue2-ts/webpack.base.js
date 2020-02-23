const VueLoaderPlugin = require('vue-loader/lib/plugin')

const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { HappyPack, happyPackLoader } = require('../base/happypack')

const init = (config) => {
  const wConfig = {
    module: {
      rules: [{
        test: /\.vue$/,
        loader: require.resolve('vue-loader'),
        options: {
          loaders: {
            js: happyPackLoader('js'),
            ts: happyPackLoader('ts')
          }
        }
      }, {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: happyPackLoader('ts')
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
      extensions: ['.ts', '.js', '.json', '.wasm', '.mjs', '.vue'],
      plugins: [new TsconfigPathsPlugin({
        configFile: path.join(config.alias.dirname, 'tsconfig.json')
      })]
    },
    resolveLoader: {
      modules: [
        path.join( __dirname, 'node_modules')
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HappyPack({
        id: 'ts',
        loaders: [{
          loader: require.resolve('ts-loader'),
          options: {
            appendTsSuffixTo: [/\.vue$/],
            happyPackMode: true
          }
        }]
      })
    ]
  }

  return wConfig
}

module.exports = init