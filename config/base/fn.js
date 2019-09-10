const resolveModule = function (str) {
  return require.resolve(str);
};

module.exports = {
  resolveModule
};