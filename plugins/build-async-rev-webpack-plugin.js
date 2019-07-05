const util = require('yyl-util');
const extFs = require('yyl-fs');
const fs = require('fs');

class BuildAsyncRevWebpackPlugin {
  constructor(config) {
    this.config = config;
  }
  apply(compiler) {
    const config = this.config;
    compiler.hooks.emit.tapAsync(
      'buildAsyncRev',
      (compilation, done) => {
        let revMap = {};
        const NO_HASH_REG = /-\w{8}\.js$/;
        Object.keys(compilation.assets).forEach((filename) => {
          const iPath = util.path.join(config.alias.jsDest, filename);
          const revPath = util.path.relative(config.alias.revRoot, iPath);
          if (/async_component/.test(iPath) && iPath.match(NO_HASH_REG)) {
            revMap[revPath.replace(NO_HASH_REG, '.js')] = revPath;

            // 生成不带hash 的文件
            compilation.assets[filename.replace(NO_HASH_REG, '.js')] = {
              source() {
                return compilation.assets[filename].source();
              },
              size() {
                return compilation.assets[filename].size();
              }
            };
          }
        });
        
        const revPath = util.path.join(config.alias.revDest, 'rev-manifest.json');
        let originRev = null;
        if (fs.existsSync(revPath)) {
          try {
            originRev = util.requireJs(revPath);
          } catch (er) { }
        } else {
          extFs.mkdirSync(config.alias.revDest);
        }
        revMap = util.extend(true, originRev, revMap);

        fs.writeFile(revPath, JSON.stringify(revMap, null, 2), () => {
          done();
        });
      }
    );
  }
}
module.exports = BuildAsyncRevWebpackPlugin;