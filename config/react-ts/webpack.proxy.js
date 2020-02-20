const { webpackMerge } = require('../base/util');
const webpackBase = require('../base/webpack.proxy');
const selfBase = require('./webpack.base');

const init = (config, iEnv) => {
  return webpackMerge(
    webpackBase(config, iEnv),
    selfBase(config, iEnv),
  );
};
module.exports = init;