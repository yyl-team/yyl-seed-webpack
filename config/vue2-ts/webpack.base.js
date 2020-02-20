const VueLoaderPlugin = require('vue-loader/lib/plugin')

const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const init = (config) => {
  const wConfig = {
    module: {
      rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
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
      new VueLoaderPlugin()
    ]
  }

  return wConfig
}

module.exports = init