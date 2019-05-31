const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');
const px2rem = require('postcss-px2rem');

const webpackBase = require('./webpack.base.js');
const util = require('yyl-util');

const init = (config, iEnv) => {
  const MODE = iEnv.NODE_ENV || 'production';

  const cssUse = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {}
    },
    {
      loader: 'css-loader',
      options: {
        modules: true,
        // url: false,
        // localIdentName: '[name]__[local]__[hash:base64:5]'
        localIdentName: '[local]'
      }
    },
    'resolve-url-loader',
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins() {
          const r = [];
          if (config.platform === 'pc') {
            r.push(autoprefixer({
              browsers: ['> 1%', 'last 2 versions']
            }));
          } else {
            r.push(autoprefixer({
              browsers: ['iOS >= 7', 'Android >= 4']
            }));
            if (config.px2rem !== false) {
              r.push(px2rem({ remUnit: 75 }));
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
        config.commit.hostname,
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
        use: cssUse.concat(['sass-loader'])
      }, {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: util.path.join(
              path.relative(
                config.alias.jsDest,
                path.join(config.alias.imagesDest, '[name].[ext]')
              )
            )
          }
        }
      }]
    },
    plugins: [
      // 环境变量 (全局替换 含有这 变量的 js)
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(MODE)
      }),
      // 样式分离插件
      new MiniCssExtractPlugin({
        filename: util.path.join(
          path.relative(
            config.alias.jsDest,
            path.join(config.alias.cssDest, '[name].css')
          )
        ),
        chunkFilename: '[name]-[hash:8].css',
        allChunks: true
      })
    ]
  };
  return webpackMerge(webpackBase(config, iEnv), webpackConfig);
};

module.exports = init;
