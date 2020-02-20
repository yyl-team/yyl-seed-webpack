const resolveModule = function (str) {
  return require.resolve(str);
};
const webpackMerge = requrie('webpack-merge');

module.exports = {
  resolveModule,
  webpackMerge
};