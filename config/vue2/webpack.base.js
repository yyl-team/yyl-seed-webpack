const VueLoaderPlugin = require('vue-loader/lib/plugin');

const init = (config, iEnv) => {
  const webpackConfig = {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  };

  return webpackConfig;
}

module.exports = init;