const fs = require('fs')
const path = require('path')
const util = require('yyl-util')

const { resolveModule } = require('./util')
const { HappyPack, happyPackLoader } = require('./happypack')

// + ts plugin
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// - ts plugin

// + sass plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const px2rem = require('postcss-px2rem')
const sass = require('sass')
// - sass plugin

const init = (config, iEnv) => {
  const resolveRoot = path.resolve(__dirname, config.alias.root)
  const isModuleInclude = (iPath, arr) => {
    if (util.type(arr) !== 'array') {
      return false
    }
    const matchModule = arr.filter((pkg) => {
      const pkgPath = path.join('node_modules', pkg)
      return iPath.includes(pkgPath)
    })
    return !!matchModule[0]
  }

  // url-loader options
  const urlLoaderOptions = {
    limit: isNaN(config.base64Limit) ? 3000 : Number(config.base64Limit),
    name: '[name]-[hash:8].[ext]',
    chunkFilename: 'async_component/[name]-[chunkhash:8].[ext]',
    outputPath: path.relative(resolveRoot, config.alias.imagesDest),
    publicPath: (function () {
      let r = util.path.join(
        config.dest.basePath,
        path.relative(resolveRoot, config.alias.imagesDest),
        '/'
      )
      if (iEnv.proxy || iEnv.remote || iEnv.isCommit) {
        r = util.path.join(config.commit.hostname, r)
      }
      return r
    })()
  }

  const wConfig = {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: (file) => {
            if (/node_modules/.test(file)) {
              if (isModuleInclude(file, config.babelLoaderIncludes)) {
                return false
              } else if (/\.vue\.js/.test(file)) {
                return false
              } else {
                return true
              }
            } else {
              return false
            }
          },
          use: happyPackLoader('js')
          // }, {
          //   test: /\.html$/,
          //   use: [
          //     resolveModule('html-loader')
          //   ]
        },
        {
          test: /\.(pug|jade)$/,
          oneOf: [
            {
              resourceQuery: /^\?vue/,
              loader: resolveModule('pug-plain-loader'),
              options: {
                self: true
              }
            },
            {
              loader: resolveModule('pug-loader'),
              options: {
                self: true
              }
            }
          ]
        },
        {
          test: /\.(svg)$/,
          use: resolveModule('svg-inline-loader')
        },
        {
          // shiming the module
          test: path.join(config.alias.srcRoot, 'js/lib/'),
          use: [
            {
              loader: resolveModule('imports-loader'),
              query: 'this=>window'
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|webp|ico)$/,
          use: [
            {
              loader: resolveModule('url-loader'),
              options: urlLoaderOptions
            }
          ]
        }
      ]
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
          const loaders = [
            {
              loader: resolveModule('babel-loader'),
              query: (() => {
                if (!config.babelrc) {
                  return {
                    babelrc: false,
                    cacheDirectory: true,
                    presets: [
                      [
                        resolveModule('@babel/preset-env'),
                        { modules: 'commonjs' }
                      ]
                    ],
                    plugins: [
                      // Stage 2
                      [
                        resolveModule('@babel/plugin-proposal-decorators'),
                        { legacy: true }
                      ],
                      [
                        resolveModule(
                          '@babel/plugin-proposal-class-properties'
                        ),
                        { loose: true }
                      ],
                      resolveModule('@babel/plugin-proposal-function-sent'),
                      resolveModule(
                        '@babel/plugin-proposal-export-namespace-from'
                      ),
                      resolveModule('@babel/plugin-proposal-numeric-separator'),
                      resolveModule('@babel/plugin-proposal-throw-expressions'),
                      resolveModule('@babel/plugin-syntax-dynamic-import')
                    ]
                  }
                } else {
                  return {}
                }
              })()
            }
          ]
          return loaders
        })()
      })
      // - happypack
    ]
  }

  // + urlLoaderMatch
  if (util.type(config.urlLoaderMatch) === 'regexp') {
    wConfig.module.rules.push({
      test: config.urlLoaderMatch,
      use: [
        {
          loader: resolveModule('url-loader'),
          options: urlLoaderOptions
        }
      ]
    })
  }
  // - urlLoaderMatch

  // + css & sass
  const cssUse = [
    {
      loader: resolveModule('style-loader'),
      options: {
        attrs: {
          'data-module': config.name || 'inline-style'
        }
      }
    },
    resolveModule('css-loader'),
    {
      loader: resolveModule('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins() {
          const r = []
          if (config.platform === 'pc') {
            r.push(
              autoprefixer({
                overrideBrowserslist: ['> 1%', 'last 2 versions']
              })
            )
          } else {
            r.push(
              autoprefixer({
                overrideBrowserslist: ['iOS >= 7', 'Android >= 4']
              })
            )
            if (config.px2rem !== false) {
              r.push(px2rem({ remUnit: 75 }))
            }
          }
          return r
        }
      }
    }
  ]
  if (iEnv.isCommit || iEnv.remote) {
    // 发版
    // 去掉 style-loader, 添加 mini-css-extract-plugin loader
    cssUse.splice(0, 1, {
      loader: MiniCssExtractPlugin.loader,
      options: {}
    })

    wConfig.plugins.push(
      // 样式分离插件
      new MiniCssExtractPlugin({
        filename: util.path.relative(
          resolveRoot,
          path.join(config.alias.cssDest, '[name]-[hash:8].css')
        ),
        chunkFilename: util.path.relative(
          resolveRoot,
          path.join(config.alias.cssDest, '[name]-[chunkhash:8].css')
        ),
        allChunks: true
      })
    )
  }
  wConfig.module.rules.splice(
    wConfig.module.rules.length,
    0,
    {
      test: /\.css$/,
      use: cssUse
    },
    {
      test: /\.(scss|sass)$/,
      use: cssUse.concat([
        {
          loader: resolveModule('sass-loader'),
          options: {
            implementation: sass
          }
        }
      ])
    }
  )
  // - css & sass

  // + ts
  const localTsConfigPath = path.join(config.alias.dirname, 'tsconfig.json')
  if (fs.existsSync(localTsConfigPath)) {
    const localPkgPath = path.join(config.alias.dirname, 'package.json')
    const localTsLoaderPath = path.join(
      config.alias.dirname,
      'node_modules',
      'ts-loader'
    )
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
        use: [
          // happyPackLoader('ts')
          {
            loader: useProjectTs
              ? require.resolve(localTsLoaderPath)
              : require.resolve('ts-loader'),
            options: {
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ]
      })

      wConfig.resolve.plugins.push(
        new TsconfigPathsPlugin({
          configFile: localTsConfigPath
        })
      )

      wConfig.resolve.extensions = wConfig.resolve.extensions.concat([
        '.tsx',
        '.ts'
      ])
    }
  }
  // - ts
  return wConfig
}

module.exports = init
