const path = require('path');
const extFs = require('yyl-fs');
const fs = require('fs');
const querystring = require('querystring');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const util = require('yyl-util');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const init = (config, iEnv) => {
  const wConfig = {
    entry: (() => {
      const iSrcRoot = path.isAbsolute(config.alias.srcRoot) ?
        config.alias.srcRoot :
        path.join(__dirname, config.alias.srcRoot);

      let r = {};

      // 合并 config 中的 entry 字段
      if (config.entry) {
        r = util.extend(true, r, config.entry);
      }

      // single entry
      var bootPath = path.join(iSrcRoot, 'boot/boot.ts');
      if (fs.existsSync(bootPath)) {
        r.boot = bootPath;
      }

      // multi entry
      var entryPath = path.join(iSrcRoot, 'entry');

      if (fs.existsSync(entryPath)) {
        var fileList = extFs.readFilesSync(entryPath, /\.ts$/);
        fileList.forEach((str) => {
          var key = path.basename(str).replace(/\.[^.]+$/, '');
          if (key) {
            r[key] = [str];
          }

          const queryObj = {
            name: key
          };

          if (config.localserver && config.localserver.port) {
            queryObj.path = `http://127.0.0.1:${config.localserver.port}/__webpack_hmr`;
          }

          const iQuery = querystring.stringify(queryObj);
          // hotreload
          if (iEnv.hot) {
            r[key].unshift(`webpack-hot-middleware/client?${iQuery}`);
          }
        });
      }

      return r;
    })(),
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }, {
        test: /\.js$/,
        exclude: (file) => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        ),
        use: [{
          loader: 'babel-loader',
          query: (() => {
            if (config.platform === 'pc') {
              return {
                babelrc: false,
                cacheDirectory: true,
                presets: [
                  ['@babel/preset-env', {
                    'targets': {
                      'browsers': ['last 2 versions', 'ie >= 7']
                    },
                    loose: true,
                    exclude: [
                      'es6.typed.array-buffer',
                      'es6.typed.data-view',
                      'es6.typed.int8-array',
                      'es6.typed.uint8-array',
                      'es6.typed.uint8-clamped-array'
                    ],
                    modules: false
                    // 'useBuiltIns': true,
                    // 'debug': true
                  }]
                ],
                plugins: [
                  // 'transform-object-rest-spread',
                  // 'transform-es3-property-literals',
                  // 'transform-es3-member-expression-literals',
                  // Stage 2
                  ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                  '@babel/plugin-proposal-function-sent',
                  '@babel/plugin-proposal-export-namespace-from',
                  '@babel/plugin-proposal-numeric-separator',
                  '@babel/plugin-proposal-throw-expressions',
                  '@babel/plugin-syntax-dynamic-import'
                ]
              };
            } else {
              return {
                babelrc: false,
                cacheDirectory: true,
                presets: [
                  ['@babel/preset-env', { modules: 'commonjs' }]
                ],
                plugins: [
                  // Stage 2
                  ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                  '@babel/plugin-proposal-function-sent',
                  '@babel/plugin-proposal-export-namespace-from',
                  '@babel/plugin-proposal-numeric-separator',
                  '@babel/plugin-proposal-throw-expressions',
                  '@babel/plugin-syntax-dynamic-import'
                ]
              };
            }
          })()
        }]
      }, {
        test: /.js$/,
        enforce: 'post', // post-loader处理
        loader: 'es3ify-loader'
      }]
    },
    plugins: [
    ],
    resolve: {
      extensions: ['.ts', '.js', '.json', '.wasm', '.mjs'],
      plugins: [new TsconfigPathsPlugin({
        configFile: path.join(config.alias.dirname, 'tsconfig.json')
      })]
    }
  };

  // + html output
  wConfig.plugins = wConfig.plugins.concat((function() { // html 输出
    const bootPath = util.path.join(config.alias.srcRoot, 'boot');
    const entryPath = util.path.join(config.alias.srcRoot, 'entry');
    let outputPath = [];
    const r = [];

    if (fs.existsSync(bootPath)) {
      outputPath = outputPath.concat(extFs.readFilesSync(bootPath, /(\.jade|\.pug|\.html)$/));
    }

    if (fs.existsSync(entryPath)) {
      outputPath = outputPath.concat(extFs.readFilesSync(entryPath, /(\.jade|\.pug|\.html)$/));
    }

    const outputMap = {};
    const ignoreExtName = function (iPath) {
      return iPath.replace(/(\.jade|.pug|\.html|\.js|\.css|\.ts)$/, '');
    };

    outputPath.forEach((iPath) => {
      outputMap[ignoreExtName(iPath)] = iPath;
    });

    const commonChunks = [];
    const pageChunkMap = {};
    Object.keys(wConfig.entry).forEach((key) => {
      let iPaths = [];
      if (util.type(wConfig.entry[key]) === 'array') {
        iPaths = wConfig.entry[key];
      } else if (util.type(wConfig.entry[key]) === 'string') {
        iPaths.push(wConfig.entry[key]);
      }

      let isPageModule = null;
      iPaths.some((iPath) => {
        const baseName = ignoreExtName(iPath);
        if (outputMap[baseName]) {
          isPageModule = baseName;
          return true;
        }
        return false;
      });

      if (!isPageModule) {
        commonChunks.push(key);
      } else {
        pageChunkMap[isPageModule] = key;
      }
    });

    outputPath.forEach((iPath) => {
      const iBaseName = ignoreExtName(iPath);
      const iChunkName = pageChunkMap[iBaseName];
      const fileName = ignoreExtName(path.basename(iPath));
      let iChunks = [];

      iChunks = iChunks.concat(commonChunks);
      if (iChunkName) {
        iChunks.push(iChunkName);
      }

      if (iChunkName) {
        const opts = {
          template: iPath,
          filename: path.relative(config.alias.jsDest, path.join(config.alias.htmlDest, `${fileName}.html`)),
          chunks: iChunks,
          chunksSortMode(a, b) {
            return iChunks.indexOf(a.names[0]) - iChunks.indexOf(b.names[0]);
          },
          inlineSource: '.(js|css|ts)\\?__inline$',
          minify: false
        };

        r.push(new HtmlWebpackPlugin(opts));
      }
    });

    return r;
  })());
  // - html output
  return wConfig;
};

init.removeBabel = (wConfig) => {
  // console.log(wConfig)
  if (wConfig.module.rules && wConfig.module.rules.length) {
    wConfig.module.rules = wConfig.module.rules.filter((item) => {
      const str = 'hello.js';
      if (util.type(item.test) === 'RegExp') {
        return str.match(item.test) ? false: true;
      } else {
        return true;
      }
    });
  }

  return wConfig;
};

module.exports = init;