const path = require('path');
const webpackMerge = require('webpack-merge');
const tsWebpackBase = require('../typescript/webpack.base');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const init = (config, iEnv) => {
  const wConfig = {
    module: {
      rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
          test: /\.ts$/,
          loader: 'ts-loader',
          // options: {
          //   appendTsSuffixTo: [/\.vue$/]
          // }
      }]
    },
    resolve: {
      modules: [
        path.join( __dirname, 'node_modules')
      ],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'vue': 'vue/dist/vue.esm.js'
      },
      extensions: ['.vue']
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
    tsWebpackBase(config, iEnv),
    wConfig
  );
};

module.exports = init;