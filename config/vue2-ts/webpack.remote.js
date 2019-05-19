const webpackMerge = require('webpack-merge');
const webpackBase = require('../base/webpack.remote');
const selfBase = require('./webpack.base');

const init = (config, iEnv) => {
  return webpackMerge(
    webpackBase(config, iEnv),
    selfBase(config, iEnv)
  );
};
module.exports = init;