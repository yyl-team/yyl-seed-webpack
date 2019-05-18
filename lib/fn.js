const os = require('os');
const fs = require('fs');
const path = require('path');
const util = require('yyl-util');

const fn = {
  getLocalServerAddress() {
    var ipObj = os.networkInterfaces();
    var ipArr;
    for (var key in ipObj) {
      if (ipObj.hasOwnProperty(key)) {
        ipArr = ipObj[key];
        for (var fip, i = 0, len = ipArr.length; i < len; i++) {
          fip = ipArr[i];
          if (fip.family.toLowerCase() == 'ipv4' && !fip.internal) {
            return fip.address;
          }
        }
      }
    }
    return '127.0.0.1';
  },
  tsconfigRewrite(configPath, seed) {
    if (!fs.existsSync(configPath)) {
      throw `configPath not exists: ${configPath}`;
    }
    const tsConfig = require(configPath);
    const rootNodeModulesPath = path.join(__dirname, '../node_modules', '*');
    const seedPath = path.join(__dirname, '../config', seed);
    const configDIr = path.dirname(configPath);
    const pathArr = ['*', path.relative(configDIr, rootNodeModulesPath)];

    if (fs.existsSync(seedPath)) {
      pathArr.push(util.path.relative(configDIr, path.join(seedPath, 'node_modules', '*')));
    }
    if (!tsConfig.compilerOptions) {
      tsConfig.compilerOptions = {};
    }

    tsConfig.compilerOptions.baseUrl = '.';
    tsConfig.compilerOptions.paths = Object.assign(tsConfig.compilerOptions.paths, {
      '*': pathArr
    });

    fs.writeFileSync(configPath, JSON.stringify(tsConfig, null, 2));
  }
};

module.exports = fn;
