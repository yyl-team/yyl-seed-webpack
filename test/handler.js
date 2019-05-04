const fs = require('fs');
const path = require('path');
const util = require('yyl-util');
const extFs = require('yyl-fs');
const print = require('yyl-print');
const extOs = require('yyl-os');
const tUtil = require('yyl-seed-test-util');

const USERPROFILE = process.env[process.platform == 'win32'? 'USERPROFILE': 'HOME'];
const RESOLVE_PATH = path.join(USERPROFILE, '.yyl/plugins/webpack');

const seed = require('../index.js');

let config = {};

print.log.init({
  maxSize: 8,
  type: {
    rev: {name: 'rev', color: 'yellow', bgColor: 'bgBlack'},
    concat: {name: 'Concat', color: 'cyan', bgColor: 'bgBlue'},
    update: {name: 'Updated', color: 'cyan', bgColor: 'bgBlue'},
    optimize: {name: 'Optimize', color: 'green', bgColor: 'bgRed'},
    cmd: {name: 'CMD', color: 'gray', bgColor: 'bgBlack'}
  }
});

const fn = {
  clearDest() {
    return new Promise((next) => {
      extFs.removeFiles(config.alias.destRoot).then(() => {
        extFs.copyFiles(config.resource).then(() => {
          next();
        });
      });
    });
  },
  async initPlugins(config) {
    if (config.plugins && config.plugins.length) {
      if (!fs.existsSync(RESOLVE_PATH)){
        extFs.mkdirSync(RESOLVE_PATH);
      }
      await tUtil.initPlugins(config.plugins, RESOLVE_PATH);
      config.resolveModule = path.join(RESOLVE_PATH, 'node_modules');
    }
    return config;
  }
};

const handler = {
  examples() {
    console.log(seed.examples);
  },
  async init(iEnv) {
    if (!iEnv.path) {
      return print.log.warn('task need --path options');
    }
    const initPath = path.resolve(process.cwd(), iEnv.path);

    // build path
    await extFs.mkdirSync(initPath);


    // init
    return await util.makeAwait((next) => {
      seed.init(iEnv.name, initPath)
        .on('msg', (...argv) => {
          const [type, iArgv] = argv;
          let iType = type;
          if (!print.log[type]) {
            iType = 'info';
          }
          print.log[iType](iArgv);
        })
        .on('finished', () => {
          extOs.openPath(initPath);
          next();
        });
    });
  },

  async all(iEnv) {
    let configPath;
    if (iEnv.config) {
      configPath = path.resolve(process.cwd(), iEnv.config);
      if (!fs.existsSync(configPath)) {
        return print.log.warn(`config path not exists: ${configPath}`);
      } else {
        config = tUtil.parseConfig(configPath);
      }
    } else {
      return print.log.warn('task need --config options');
    }

    config = await fn.initPlugins(config);

    const CONFIG_DIR = path.dirname(configPath);
    const opzer = seed.optimize(config, CONFIG_DIR);

    await fn.clearDest(config);
    return await util.makeAwait((next) => {
      opzer.all(iEnv)
        .on('msg', (...argv) => {
          const [type, iArgv] = argv;
          let iType = type;
          if (!print.log[type]) {
            iType = 'info';
          }
          print.log[iType](iArgv);
        })
        .on('clear', () => {
          print.cleanScreen();
        })
        .on('finished', () => {
          print.log.success('task finished');
          next();
        });
    });
  },
  async watch(iEnv) {
    let configPath;
    if (iEnv.silent) {
      print.log.setLogLevel(0);
    }
    if (iEnv.config) {
      configPath = path.resolve(process.cwd(), iEnv.config);
      if (!fs.existsSync(configPath)) {
        return print.log.warn(`config path not exists: ${configPath}`);
      } else {
        config = tUtil.parseConfig(configPath);
      }
    } else {
      return print.log.warn('task need --config options');
    }

    config = await fn.initPlugins(config);

    const CONFIG_DIR = path.dirname(configPath);
    const opzer = seed.optimize(config, CONFIG_DIR);

    // 本地服务器
    await tUtil.server.start(config.alias.destRoot, config.localserver.port || 5000);

    opzer.initServerMiddleWare(tUtil.server.getAppSync(), iEnv);

    await fn.clearDest(config);

    return util.makeAwait((next) => {
      opzer.watch(iEnv)
        .on('clear', () => {
          if (!iEnv.silent) {
            print.cleanScreen();
          }
        })
        .on('msg', (...argv) => {
          const [type, iArgv] = argv;
          let iType = type;
          if (!print.log[type]) {
            iType = 'info';
          }
          if (!iEnv.silent) {
            print.log[iType](iArgv);
          }
        })
        .on('finished', () => {
          if (!iEnv.silent) {
            print.log.success('task finished');
          }
          next();
        });
    });
  },
  async abort() {
    return await tUtil.server.abort();
  },
  async make(iEnv) {
    let configPath;
    if (iEnv.config) {
      configPath = path.resolve(process.cwd(), iEnv.config);
      if (!fs.existsSync(configPath)) {
        return print.log.warn(`config path not exists: ${configPath}`);
      } else {
        config = tUtil.parseConfig(configPath);
      }
    } else {
      return print.log.warn('task need --config options');
    }

    await fn.clearDest(config);
    await util.makeAwait((next) => {
      seed.make(iEnv.name, config)
        .on('start', () => {
          print.cleanScreen();
        })
        .on('msg', (...argv) => {
          const [type, iArgv] = argv;
          let iType = type;
          if (!print.log[type]) {
            iType = 'info';
          }
          print.log[iType](iArgv);
        })
        .on('finished', () => {
          print.log.success('task finished');
          next();
        });
    });
  }
};

module.exports = handler;