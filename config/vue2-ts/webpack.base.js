const webpackMerge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const path = require('path');
const util = require('yyl-util');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const init = (config) => {
  const wConfig = {
    output: {
      path: path.resolve(__dirname, config.alias.jsDest),
      filename: '[name].js',
      chunkFilename: `async_component/[name]${config.disableHash? '' : '-[chunkhash:8]'}.js`
    },
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
      alias: util.extend({
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
  };

  return webpackMerge(
    wConfig
  );
};

module.exports = init;