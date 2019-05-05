const webpackMerge = require('webpack-merge');
const webpackBase = require('../webpack/webpack.dev');
const selfBase = require('./webpack.base');

const init = (config, iEnv) => {
  return webpackMerge(
    selfBase(config, iEnv),
    selfBase.removeBabel(webpackBase(config, iEnv))
  );
};
module.exports = init;