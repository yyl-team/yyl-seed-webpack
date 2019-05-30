const util = require('yyl-util');
const SeedResponse = require('yyl-seed-response');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const extOs = require('yyl-os');
const fs = require('fs');
const path = require('path');

const USAGE = {
  watch: 'watch',
  all: 'all'
};

let config;
let iRes = null;

const cache = {
  app: undefined,
  root: null
};

const fn = {
  envInit(op) {
    let rEnv;
    if (typeof op !== 'object') {
      rEnv = {};
    } else {
      rEnv = op;
    }

    if (rEnv.ver == 'remote') {
      rEnv.remote = true;
    }
    if (rEnv.remote) {
      rEnv.ver = 'remote';
    }

    rEnv.staticRemotePath = (rEnv.remote || rEnv.isCommit || rEnv.proxy) ? (config.commit.staticHost || config.commit.hostname) : '/';
    rEnv.mainRemotePath = (rEnv.remote || rEnv.isCommit || rEnv.proxy) ? (config.commit.mainHost || config.commit.hostname) : '/';
    return rEnv;
  },
  buildWConfig(iEnv) {
    let iWconfig;
    let wConfigPath;
    let wConfigName;
    const configRoot = path.join(__dirname, '../config');
    let wConfigProfixPath = path.join(configRoot, 'webpack');
    if (config.seed) {
      wConfigProfixPath = path.join(configRoot, config.seed);
      if (!fs.existsSync(wConfigProfixPath)) {
        throw `buildWconfig error, config.seed is not in rules: ${config.seed}`;
      }
    }

    if (iEnv.isCommit) {
      wConfigName = 'webpack.publish.js';
    } else if (iEnv.remote) {
      wConfigName = 'webpack.remote.js';
    } else if (iEnv.proxy) {
      wConfigName = 'webpack.proxy.js';
    } else {
      wConfigName = 'webpack.dev.js';
    }

    wConfigPath = path.join(wConfigProfixPath, wConfigName);

    iWconfig = require(wConfigPath);

    if (cache.app) {
      iEnv.hot = true;
    }
    const r = iWconfig(config, iEnv);
    if (cache.root) {
      let wPath = util.path.join(cache.root, 'webpack.config.js');
      if (config.webpackConfigPath) {
        wPath = util.path.resolve(cache.root, config.webpackConfigPath);
      }
      if (fs.existsSync(wPath)) {
        return webpackMerge(r, require(wPath));
      }
      return r;
    } else {
      return r;
    }
  },
  webpackFinishedHandle(iRes, iEnv, done) {
    return (err, stats) => {
      if (err) {
        iRes.trigger('msg', ['error', err]);
      } else {
        iRes.trigger('msg', ['success', 'webpack run pass']);

        if (iEnv.logLevel == 2) {
          console.log(stats.toString({
            chunks: false,  // 使构建过程更静默无输出
            colors: true    // 在控制台展示颜色
          }));
        } else {
          iRes.trigger('msg', ['info', stats.toString()]);
        }

        const compilation = stats.compilation;
        const basePath = compilation.outputOptions.path;

        Object.keys(compilation.assets).forEach((key) => {
          const iPath = util.path.join(basePath, key);
          iRes.trigger('msg', [fs.existsSync(iPath)? 'update': 'create', iPath]);
        });
        compilation.errors.forEach((err) => {
          iRes.trigger('msg', ['error', err.message || err.details || err]);
        });
        compilation.warnings.forEach((warn) => {
          iRes.trigger('msg', ['warn', warn.details]);
        });
      }
      iRes.trigger('finished', []);
      return done && done();
    };
  }
};

const task = {
  async preCheck () {
    if (!cache.root) {
      return;
    }
    // + 版本校验
    // 检查是否存在 package.json
    const pkgPath = util.path.join(cache.root, 'package.json');
    if (fs.existsSync(pkgPath)) {
      await extOs.installPackage(pkgPath);
    }

    // 检查 seed 包 package.json 是否已经初始化
    if (!config.seed) {
      throw 'config.seed is null';
    }
    if (config.seed) {
      const seedDir = path.join(__dirname, '../config', config.seed);
      if (fs.existsSync(seedDir)) {
        const pkgPath = path.join(seedDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
          await extOs.installPackage(pkgPath);
        }
      } else {
        throw `config.seed=${config.seed} is not exists`;
      }
    }
    // - 版本校验
    // + tsconfig rewrite
    // const tsconfigPath = path.join(cache.root, 'tsconfig.json');
    // if (fs.existsSync(tsconfigPath)) {
    //   gFn.tsconfigRewrite(tsconfigPath, config.seed);
    // }
    // - tsconfig rewrite
  },
  all(iEnv, done) {
    const iRes = new SeedResponse();
    iRes.trigger('clear', []);

    task.preCheck().then(() => {
      const config = fn.buildWConfig(iEnv);
      const compiler = webpack(config);

      iRes.trigger('start', ['watch']);

      compiler.run(fn.webpackFinishedHandle(iRes, iEnv, done));
    });

    return iRes;
  },
  watch(iEnv) {
    const iRes = new SeedResponse();

    iRes.trigger('clear', []);
    task.preCheck().then(() => {
      const config = fn.buildWConfig(iEnv);
      const compiler = webpack(config);

      compiler.hooks.beforeCompile.tapPromise('beforeCompile', async () => {
        iRes.trigger('clear', []);
        iRes.trigger('start', ['watch']);
      });

      if (cache.app) {
        let devMiddleware = null;
        let hotMiddleware = null;

        devMiddleware = require('webpack-dev-middleware');
        hotMiddleware = require('webpack-hot-middleware');

        cache.app.use(devMiddleware(compiler, {
          noInfo: true,
          publicPath: config.output.publicPath,
          writeToDisk: true,
          headers: { 'Access-Control-Allow-Origin': '*' },
          reporter(middlewareOptions, options) {
            let stats = null;
            if (options && options.stats && options.state !== false) {
              stats = options.stats;
            }


            if (stats) {
              fn.webpackFinishedHandle(iRes, iEnv)(null, stats);
            }
          },
          watchOptions: {
            aggregateTimeout: 1000
          }
        }));


        cache.app.use(hotMiddleware(compiler, {
          publicPath: config.output.publicPath,
          log: false
        }));
      } else {
        compiler.watch({
          aggregateTimeout: 1000
        }, fn.webpackFinishedHandle(iRes, iEnv));
      }
    });

    return iRes;
  }
};

const wOpzer = function (iConfig, root) {
  config = util.extend(true, {}, iConfig);

  const opzer = {};

  Object.keys(USAGE).forEach((key) => {
    opzer[key] = function(op) {
      return task[key](fn.envInit(op));
    };
  });

  opzer.getConfigSync = function() {
    return config;
  };

  opzer.response = iRes;

  cache.root = root;
  opzer.root = root;

  opzer.ignoreLiveReload = true;

  opzer.initServerMiddleWare = function (app) {
    cache.app = app;
  };

  return opzer;
};

wOpzer.handles = Object.keys(USAGE);
wOpzer.withServer = true;

module.exports = wOpzer;
