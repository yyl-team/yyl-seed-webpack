const webpackMerge = require('webpack-merge');
const webpackBase = require('../base/webpack.remote');
const selfBase = require('./webpack.base');

const init = (config, iEnv) => {
  return webpackMerge(
    selfBase(config, iEnv),
    webpackBase(config, iEnv)
  );
};
module.exports = init;