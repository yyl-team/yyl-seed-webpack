const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const px2rem = require('postcss-px2rem');

const BuildBlankCssWebpackPlugin = require('../../plugins/build-blank-css-webpack-plugin');
const webpackBase = require('./webpack.base.js');
const util = require('yyl-util');

const { resolveModule } = require('./fn');

const init = (config, iEnv) => {
  const MODE = iEnv.NODE_ENV || 'development';

  const cssUse = [
    resolveModule('style-loader'),
    resolveModule('css-loader'),
    {
      loader: resolveModule('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins() {
          const r = [];
          if (config.platform === 'pc') {
            r.push(autoprefixer({
              overrideBrowserslist: ['> 1%', 'last 2 versions']
            }));
          } else {
            r.push(autoprefixer({
              overrideBrowserslist: ['iOS >= 7', 'Android >= 4']
            }));
            if (config.px2rem !== false) {
              r.push(px2rem({remUnit: 75}));
            }
          }
          return r;
        }
      }
    }
  ];

  const webpackConfig = {
    mode: MODE,
    output: {
      publicPath: util.path.join(
        config.dest.basePath,
        path.relative(
          config.alias.root,
          config.alias.jsDest
        ),
        '/'
      )
    },
    module: {
      rules: [{
        test: /\.css$/,
        use: cssUse
      }, {
        test: /\.(scss|sass)$/,
        use: cssUse.concat([resolveModule('sass-loader')])
      }]
    },
    plugins: [
      // 环境变量 (全局替换 含有这 变量的 js)
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(MODE)
      }),
      new BuildBlankCssWebpackPlugin(config)
    ]
  };
  return webpackMerge(webpackBase(config, iEnv), webpackConfig);
};

module.exports = init;
