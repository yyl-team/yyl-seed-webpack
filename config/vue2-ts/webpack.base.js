const VueLoaderPlugin = require('vue-loader/lib/plugin');

const path = require('path');

const init = () => {
  const wConfig = {
    module: {
      rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
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
      extensions: ['.ts', '.js', '.json', '.wasm', '.mjs', '.vue']
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

  return wConfig;
};

module.exports = init;