'use strict';
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const querystring = require('querystring');
const extFs = require('yyl-fs');
const es3ifyWebpackPlugin = require('es3ify-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const util = require('yyl-util');

const BuildAsyncRevWebpackPlugin = require('../../plugins/build-async-rev-webpack-plugin');
const Ie8FixWebpackPlugin = require('../../plugins/ie8-fix-webpack-plugin');

// const map2Babel = function (str) {
//   const nodeModulePath1 = path.join(__dirname, '../../');
//   const nodeModulePath2 = path.join(__dirname, '../../../');
//   const path1 = path.join(nodeModulePath1, 'node_modules/@babel');
//   if (fs.existsSync(path1)) {
//     return util.path.join(nodeModulePath1, 'node_modules', str);
//   } else {
//     return util.path.join(nodeModulePath2, str);
//   }
// };

const init = (config, iEnv) => {
  const wConfig = {
    entry: (function() {
      const iSrcRoot = path.isAbsolute(config.alias.srcRoot) ?
        config.alias.srcRoot :
        path.join(__dirname, config.alias.srcRoot);

      let r = {};

      // 合并 config 中的 entry 字段
      if (config.entry) {
        r = util.extend(true, r, config.entry);
      }

      // multi entry
      var entryPath = path.join(iSrcRoot, 'entry');

      if (fs.existsSync(entryPath)) {
        var fileList = extFs.readFilesSync(entryPath, /\.(js|tsx?)$/);
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
          if (iEnv.hot && !config.ie8) {
            r[key].unshift(`webpack-hot-middleware/client?${iQuery}`);
          }
        });
      }

      return r;
    })(),
    output: {
      path: path.resolve(__dirname, config.alias.jsDest),
      filename: '[name].js',
      chunkFilename: `async_component/[name]${config.disableHash? '' : '-[chunkhash:8]'}.js`
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: (file) => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        ),
        use: (() => {
          const loaders = [{
            loader: 'babel-loader',
            query: (() => {
              if (!config.babelrc) {
                return {
                  babelrc: false,
                  cacheDirectory: true,
                  presets: [
                    ['@babel/preset-env', { modules: 'commonjs' }]
                  ],
                  plugins: [
                    // Stage 2
                    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                    '@babel/plugin-proposal-function-sent',
                    '@babel/plugin-proposal-export-namespace-from',
                    '@babel/plugin-proposal-numeric-separator',
                    '@babel/plugin-proposal-throw-expressions',
                    '@babel/plugin-syntax-dynamic-import'
                  ]
                };
              } else {
                return {};
              }
            })()
          }];

          const eslintrcPath = path.join(config.alias.dirname, '.eslintrc.js');
          if (
            config.eslint &&
            fs.existsSync(eslintrcPath)
          ) {
            loaders.push({
              loader: 'eslint-loader',
              options: {
                formatter: 'eslint-friendly-formatter'
              }
            });
          }

          return loaders;
        })()
      }, {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      }, {
        test: /\.html$/,
        use: [{
          loader: 'html-loader'
        }]
      }, {
        test: /\.pug$/,
        oneOf: [{
          resourceQuery: /^\?vue/,
          use: ['pug-plain-loader']
        }, {
          use: ['pug-loader']
        }]
      }, {
        test: /\.jade$/,
        oneOf: [{
          resourceQuery: /^\?vue/,
          use: ['pug-plain-loader']
        }, {
          use: ['pug-loader']
        }]
      }, {
        test: /\.svg$/,
        use: {
          loader: 'svg-inline-loader'
        }
      }, {
        test: /\.webp$/,
        loaders: ['file-loader']
      }, {
        test: /\.ico$/,
        loaders: ['file-loader']
      }, {
        test: /\.ico$/,
        loaders: ['file-loader']
      }, {
        // shiming the module
        test: path.join(config.alias.srcRoot, 'js/lib/'),
        use: {
          loader: 'imports-loader?this=>window'
        }
      }, {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: isNaN(config.base64Limit) ? 3000 : Number(config.base64Limit),
            name: '[name].[ext]',
            chunkFilename: `async_component/[name]${config.disableHash? '' : '-[chunkhash:8]'}.js`,
            outputPath: path.relative(
              config.alias.jsDest,
              config.alias.imagesDest
            ),
            publicPath: (function () {
              let r = util.path.join(
                config.dest.basePath,
                path.relative(
                  config.alias.root,
                  config.alias.imagesDest
                ),
                '/'
              );
              if (iEnv.proxy || iEnv.remote || iEnv.isCommit) {
                r = util.path.join(config.commit.hostname, r);
              }
              return r;
            })()
          }
        }
      }]
    },
    resolveLoader: {
      modules: [
        path.join( __dirname, 'node_modules'),
        path.join(config.alias.dirname, 'node_modules')
      ]
    },
    resolve: {
      modules: [
        path.join( __dirname, 'node_modules'),
        path.join(config.alias.dirname, 'node_modules')
      ],
      alias: config.alias
    },
    devtool: 'source-map',
    extensions: ['.ts', '.js', '.json', '.wasm', '.mjs', '.tsx', '.jsx'],
    plugins: [
      new BuildAsyncRevWebpackPlugin(config),
      new TsconfigPathsPlugin({
        configFile: path.join(config.alias.dirname, 'tsconfig.json')
      })
    ],
    optimization: {
      minimizer: [
        new UglifyjsWebpackPlugin({
          uglifyOptions: {
            ie8: config.ie8 ? true: false
          }
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  };

  // hot reload
  if (!config.ie8 && iEnv.hot) {
    wConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  // providePlugin
  if (config.providePlugin) {
    wConfig.plugins.push(new webpack.ProvidePlugin(config.providePlugin));
  }

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
      return iPath.replace(/(\.jade|.pug|\.html|\.js|\.css|\.ts|\.tsx|\.jsx)$/, '');
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
          chunksSortMode (a, b) {
            return iChunks.indexOf(a.names[0]) - iChunks.indexOf(b.names[0]);
          },
          inlineSource: '.(js|css|ts|tsx|jsx)\\?__inline$',
          minify: false
        };

        r.push(new HtmlWebpackPlugin(opts));
      }
    });

    return r;
  })());
  // - html output

  // env defined
  // 环境变量 (全局替换 含有这 变量的 js)
  wConfig.plugins.push((() => {
    const r = {};
    Object.keys(iEnv).forEach((key) => {
      if ( typeof iEnv[key] === 'string') {
        r[`process.env.${key}`] = JSON.stringify(iEnv[key]);
      } else {
        r[`process.env.${key}`] = iEnv[key];
      }
    });

    return new webpack.DefinePlugin(r);
  })());

  // ie8 格式化
  if (config.ie8) {
    wConfig.plugins = wConfig.plugins.concat([
      new es3ifyWebpackPlugin(),
      new Ie8FixWebpackPlugin()
    ]);
  }

  // config.module 继承
  if (config.moduleRules) {
    wConfig.module.rules = wConfig.module.rules.concat(config.moduleRules);
  }

  // extend node_modules
  if (config.resolveModule) {
    wConfig.resolve.modules.unshift(config.resolveModule);
    wConfig.resolveLoader.modules.unshift(config.resolveModule);
  }

  // add seed node_modules 
  if (config.seed) {
    const nodeModulePath = path.join(__dirname, '../', config.seed, 'node_modules');
    if (fs.existsSync(nodeModulePath)) {
      wConfig.resolve.modules.unshift(nodeModulePath);
      wConfig.resolveLoader.modules.unshift(nodeModulePath);
    }
  }

  return wConfig;
};





module.exports = init;



