class Ie8FixWebpackPlugin {
  constructor() {
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ie8Fix',
      (compilation, done) => {
        Object.keys(compilation.assets).forEach((key) => {
          let cnt = compilation.assets[key].source();
          cnt = cnt.replace(/(\w+)\.default\(/g, '$1[\'default\'](');
          compilation.assets[key] = {
            source() {
              return cnt;
            },
            size() {
              return cnt.length;
            }
          };
        });
        done();
      }
    );
  }
}
module.exports = Ie8FixWebpackPlugin;