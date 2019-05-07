const path = require('path');
const util = require('yyl-util');
// 生成 空白 css 插件
class BuildBlankCssWebpackPlugin {
  constructor(config) {
    this.config = config;
  }
  apply(compiler) {
    const config = this.config;
    compiler.hooks.emit.tapAsync(
      'buildBlankCss',
      (compilation, done) => {
        const files = [];
        for (let filename in compilation.assets) {
          let iPath = util.path.join(filename);
          if (
            !/^\.\.\//.test(iPath) &&
            path.extname(iPath) === '.js' &&
            iPath.split('/').length === 1
          ) {
            files.push(iPath.replace(/\.js/, ''));
          }
        }

        files.forEach((name) => {
          const rPath = path.relative(
            config.alias.jsDest,
            path.join(config.alias.cssDest, `${name}.css`)
          );
          compilation.assets[rPath] = {
            source() {
              return '';
            },
            size() {
              return 0;
            }
          };
        });
        done();
      }
    );
  }
}

module.exports = BuildBlankCssWebpackPlugin;