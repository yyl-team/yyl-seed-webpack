const fs = require('fs')
const path = require('path')
const util = require('yyl-util')

const { resolveModule } = require('./util')
const { HappyPack, happyPackLoader } = require('./happypack')

// + ts plugin
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// - ts plugin

// + sass plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const px2rem = require('postcss-px2rem')
const sass = require('sass')
// - sass plugin

const init = (config, iEnv) => {
  const wConfig = {
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: (file) => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        ),
        use: happyPackLoader('js')
      }, {
        test: /\.html$/,
        use: resolveModule('html-loader')
      }, {
        test: /\.(pug|jade)$/,
        oneOf: [{
          resourceQuery: /^\?vue/,
          use: resolveModule('pug-plain-loader')
        }, {
          use: resolveModule('pug-loader')
        }]
      }, {
        test: /\.svg$/,
        use: resolveModule('svg-inline-loader')
      }, {
        test: /\.(webp|ico)$/,
        use: resolveModule('url-loader')
      }, {
        // shiming the module
        test: path.join(config.alias.srcRoot, 'js/lib/'),
        use: [{
          loader: resolveModule('imports-loader'),
          query: 'this=>window'
        }]
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: resolveModule('url-loader'),
          options: {
            limit: isNaN(config.base64Limit) ? 3000 : Number(config.base64Limit),
            name: '[name]-[hash:8].[ext]',
            chunkFilename: 'async_component/[name]-[chunkhash:8].js',
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
              )
              if (iEnv.proxy || iEnv.remote || iEnv.isCommit) {
                r = util.path.join(config.commit.hostname, r)
              }
              return r
            })()
          }
        }]
      }]
    },
    resolve: {
      extensions: ['.js', '.json', '.wasm', '.mjs', '.jsx'],
      plugins: []
    },
    plugins: [
      // + happypack
      new HappyPack({
        id: 'js',
        verbose: false,
        loaders: (() => {
          const loaders = [{
            loader: resolveModule('babel-loader'),
            query: (() => {
              if (!config.babelrc) {
                return {
                  babelrc: false,
                  cacheDirectory: true,
                  presets: [
                    [resolveModule('@babel/preset-env'), { modules: 'commonjs' }]
                  ],
                  plugins: [
                    // Stage 2
                    [resolveModule('@babel/plugin-proposal-decorators'), { 'legacy': true }],
                    [resolveModule('@babel/plugin-proposal-class-properties'), { 'loose': true }],
                    resolveModule('@babel/plugin-proposal-function-sent'),
                    resolveModule('@babel/plugin-proposal-export-namespace-from'),
                    resolveModule('@babel/plugin-proposal-numeric-separator'),
                    resolveModule('@babel/plugin-proposal-throw-expressions'),
                    resolveModule('@babel/plugin-syntax-dynamic-import')
                  ]
                }
              } else {
                return {}
              }
            })()
          }]
          return loaders
        })()
      })
      // - happypack
    ]
  }

  // + css & sass
  const cssUse = [
    resolveModule('style-loader'),
    resolveModule('css-loader'),
    {
      loader: resolveModule('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins() {
          const r = []
          if (config.platform === 'pc') {
            r.push(autoprefixer({
              overrideBrowserslist: ['> 1%', 'last 2 versions']
            }))
          } else {
            r.push(autoprefixer({
              overrideBrowserslist: ['iOS >= 7', 'Android >= 4']
            }))
            if (config.px2rem !== false) {
              r.push(px2rem({remUnit: 75}))
            }
          }
          return r
        }
      }
    }
  ]
  if (iEnv.isCommit) { // 发版
    // 去掉 style-loader, 添加 mini-css-extract-plugin loader
    cssUse.splice(0, 1, {
      loader: MiniCssExtractPlugin.loader,
      options: {}
    })

    wConfig.plugins.push(
      // 样式分离插件
      new MiniCssExtractPlugin({
        filename: util.path.join(
          path.relative(
            config.alias.jsDest,
            path.join(config.alias.cssDest, '[name]-[hash:8].css')
          )
        ),
        chunkFilename: '[name]-[hash:8].css',
        allChunks: true
      })
    )
  }
  wConfig.module.rules.splice( wConfig.module.rules.length, 0, {
    test: /\.css$/,
    use: cssUse
  }, {
    test: /\.(scss|sass)$/,
    use: cssUse.concat([
      {
        loader: resolveModule('sass-loader'),
        options: {
          implementation: sass
        }
      }
    ])
  })
  // - css & sass

  // + ts
  const localTsConfigPath = path.join(config.alias.dirname, 'tsconfig.json')
  if (fs.existsSync(localTsConfigPath)) {
    const localPkgPath = path.join(config.alias.dirname, 'package.json')
    const localTsLoaderPath = path.join(config.alias.dirname, 'node_modules', 'ts-loader')
    const localTsLoaderExists = fs.existsSync(localTsLoaderPath)
    let useProjectTs = false
    if (fs.existsSync(localPkgPath)) {
      const localPkg = require(localPkgPath)
      if (
        localPkg.dependencies &&
        localPkg.dependencies['ts-loader'] &&
        localPkg.dependencies['typescript'] &&
        localTsLoaderExists
      ) {
        useProjectTs = true
      }

      wConfig.module.rules.push({
        test: /\.tsx?$/,
        use: [{
          loader: useProjectTs ? require.resolve(localTsLoaderPath) : require.resolve('ts-loader'),
          options: {
            appendTsSuffixTo: [/\.vue$/]
            // happyPackMode: true
            // transpileOnly: true
          }
        }],
        exclude: /node_modules/
      })

      wConfig.resolve.plugins.push(
        new TsconfigPathsPlugin({
          configFile: localTsConfigPath
        })
      )

      wConfig.resolve.extensions.splice(wConfig.resolve.extensions.length, 0, '.tsx', '.ts')
    }
  }
  // - ts
  return wConfig
}

module.exports = init
