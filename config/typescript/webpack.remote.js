const webpackMerge = require('webpack-merge');
const selfBase = require('./webpack.base');

const init = (config, iEnv) => {
  const wConfig = {
  };

  return webpackMerge(selfBase(config, iEnv), wConfig);
};

module.exports = init;