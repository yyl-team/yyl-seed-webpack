const webpackMerge = require('webpack-merge');
const webpackBase = require('../webpack/webpack.publish');
const selfBase = require('./webpack.base');

const init = (config, iEnv) => {
  return webpackMerge(
    selfBase(config, iEnv),
    selfBase.removeBabel(webpackBase(config, iEnv))
  );
};
module.exports = init;