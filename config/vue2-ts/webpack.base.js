const util = require('yyl-util');
const webpackMerge = require('webpack-merge');
const vue2WebpackBase = require('../vue2/webpack.base');
const tsWebpackBase = require('../typescript/webpack.base');

const init = (config, iEnv) => {
  const wConfig = {
    module: {
      rules: []
    },
    resolve: {
      modules: [
        path.join( __dirname, 'node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        path.join( __dirname, 'node_modules')
      ]
    },
  };

  return webpackMerge(
    vue2WebpackBase,
    tsWebpackBase,
    wConfig
  );
};

module.exports = init;