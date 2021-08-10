import fs from 'fs'
import path from 'path'
import extOs from 'yyl-os'
import chalk from 'chalk'
import SeedResponse, { ResponseFn } from 'yyl-seed-response'
import { SeedOptimize, SeedOptimizeOption, SeedOptimizeResult } from 'yyl-seed-base'
import { ProgressPlugin, webpack, WebpackOptionsNormalized } from 'webpack'
import { merge } from 'webpack-merge'
import { buildWConfig, envInit, toCtx, initCompilerLog } from './util'
import { LANG, PLUGIN_NAME } from './const'
import WebpackDevServer, { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import { initMiddleWare } from 'yyl-base-webpack-config'

const pkg = require('../package.json')

export interface OptimizeOption extends SeedOptimizeOption {}

/** optimize 返回 */
export interface OptimizeResult extends SeedOptimizeResult {}

/** 构建函数 */
export const optimize: SeedOptimize = async (option: OptimizeOption) => {
  let { yylConfig, root, env, ctx } = option
  // response 初始化
  const iRes = new SeedResponse()

  // + 运行前校验
  // npm 包自动安装
  const pkgPath = path.join(root, 'package.json')
  if (fs.existsSync(pkgPath)) {
    iRes.trigger('progress', ['start', 'info', [LANG.OPTIMIZE.CHECK_SEED_PKG_START]])
    await extOs.installPackage(pkgPath, {
      production: false,
      loglevel: env.silent ? 'silent' : 'http',
      useYarn: !!yylConfig.yarn,
      showOutput(msg) {
        iRes.trigger('msg', ['info', [msg.toString()]])
      }
    })
    iRes.trigger('progress', ['finished', 'info', [LANG.OPTIMIZE.CHECK_SEED_PKG_FINISHED]])
  }

  // 老版本兼容
  if (toCtx<string>(yylConfig.workflow) === 'webpack-vue2') {
    yylConfig.workflow = 'webpack'
    yylConfig.seed = 'vue2'
  }

  // 老版本兼容
  if (yylConfig.workflow === 'webpack' && yylConfig.seed === 'vue2') {
    iRes.trigger('progress', ['start', 'info', [LANG.OPTIMIZE.LEGACY_POLYFILL_START]])
    if (!fs.existsSync(pkgPath)) {
      fs.writeFileSync(
        pkgPath,
        JSON.stringify(
          {
            name: 'vue2-project'
          },
          null,
          2
        )
      )
    }
    let needInstall = true
    const rootPkg = require(pkgPath)
    if (rootPkg.dependencies && Object.keys(rootPkg.dependencies).includes('vue')) {
      needInstall = false
    } else if (rootPkg.devDependencies && Object.keys(rootPkg.devDependencies).includes('vue')) {
      needInstall = false
    }
    if (needInstall) {
      const plugins = ['vue@2.6.12', 'vue-router@3.5.1', 'vuex@3.6.2']
      let cmd = `npm i ${plugins.join(' ')} --save`
      if (yylConfig.yarn) {
        cmd = `yarn add ${plugins.join(' ')}`
      }
      cmd += ` --loglevel ${env.silent ? 'silent' : 'http'}`
      iRes.trigger('msg', ['info', [LANG.OPTIMIZE.ADD_VUE_DEPENDENCIES]])
      iRes.trigger('msg', ['cmd', [cmd]])
      await extOs.runSpawn(cmd, root, (msg) => {
        iRes.trigger('msg', ['info', [msg.toString()]])
      })
    }
    iRes.trigger('progress', ['finished', 'success', [LANG.OPTIMIZE.LEGACY_POLYFILL_FINISHED]])

    // 不再支持 带 zepto 的支持 - 针对老旧项目
    if (rootPkg.dependencies && rootPkg.dependencies.zepto) {
      throw new Error(
        `${LANG.OPTIMIZE.ZEPTO_NOT_SUPPORTED}: ${chalk.yellow('pkg.dependencies.zepto')}`
      )
    } else if (rootPkg.devDependencies && rootPkg.devDependencies.zepto) {
      throw new Error(
        `${LANG.OPTIMIZE.ZEPTO_NOT_SUPPORTED}: ${chalk.yellow('pkg.devDependencies.zepto')}`
      )
    } else if (yylConfig?.alias?.zepto) {
      throw new Error(
        `${LANG.OPTIMIZE.ZEPTO_NOT_SUPPORTED}: ${chalk.yellow('yylConfig.alias.zepto')}`
      )
    }
  }

  // - 运行前校验

  const wConfig = buildWConfig({
    yylConfig,
    env,
    root,
    ctx,
    response: iRes
  })

  const getVersion = (ctx: string) => {
    if (ctx) {
      return ctx.replace(/^[\^~]/, '')
    } else {
      return 'undefined'
    }
  }
  const webpackVersion = getVersion(pkg.dependencies.webpack)
  const webpackCliVersion = getVersion(pkg.dependencies['webpack-cli'])
  const devServerVersion = getVersion(pkg.dependencies['webpack-dev-server'])
  iRes.trigger('msg', [
    'info',
    [
      `${LANG.OPTIMIZE.WEBPACK_VERSION}:`,
      `webpack: ${chalk.yellow(webpackVersion)}`,
      `webpack-cli: ${chalk.yellow(webpackCliVersion)}`,
      `webpack-dev-server: ${chalk.yellow(devServerVersion)}`
    ]
  ])

  if (env.logLevel === 2) {
    if (wConfig.resolve.fallback) {
      iRes.trigger('msg', [
        'info',
        [
          `${LANG.OPTIMIZE.WEBPACK_RESOLVE_FALLBACK}:`,
          ...Object.keys(wConfig.resolve.fallback).map((key) => {
            return `${key}: ${chalk.yellow(`${(wConfig.resolve.fallback as any)[key]}`)}`
          })
        ]
      ])
    }
    if (wConfig.resolve.alias) {
      iRes.trigger('msg', [
        'info',
        [
          `${LANG.OPTIMIZE.WEBPACK_RESOLVE_ALIAS}:`,
          ...Object.keys(wConfig.resolve.alias).map((key) => {
            return `${key}: ${chalk.yellow(`${(wConfig.resolve.alias as any)[key]}`)}`
          })
        ]
      ])
    }
  }

  const compiler = webpack(
    merge(wConfig, {
      stats: 'none',
      infrastructureLogging: {
        level: 'none'
      },
      plugins: [
        new ProgressPlugin({
          activeModules: true,
          handler(percentage, ...args) {
            if (percentage === 0) {
              iRes.trigger('progress', ['start', 'info', args])
            } else if (percentage === 1) {
              iRes.trigger('progress', [1, 'info', args])
              // 特殊标识，告诉 hander 可以执行后置脚本
              iRes.trigger('progress', ['finished', 'success', ['done']])
            } else {
              if (env.logLevel !== 2 && env.logLevel !== 0) {
                iRes.trigger('progress', [percentage, 'info', args])
              }
            }
          }
        })
      ]
    } as any)
  )

  /** 使用项目自带server */
  const usePjServer = !!yylConfig.localserver?.entry

  // env 初始化
  env = envInit({ env, yylConfig })
  const opzer: OptimizeResult = {
    root: root,
    response: iRes,
    handles: ['watch', 'all'],
    ignoreServer: true,
    getConfigSync() {
      return yylConfig
    },

    async appWillMount(app) {
      initMiddleWare({
        app,
        env,
        compiler,
        yylConfig,
        logger(type, subType, args) {
          iRes.trigger(type, [subType, args])
        }
      })
    },

    on<A extends any[] = any[]>(eventName: string, fn: ResponseFn<A>) {
      iRes.on(eventName, fn)
      return opzer
    },

    all() {
      initCompilerLog({
        compiler,
        response: iRes,
        env
      })

      compiler.run(() => undefined)
      return opzer
    },

    watch() {
      iRes.trigger('msg', ['info', [LANG.OPTIMIZE.WEBPACK_RUN_START]])
      if (usePjServer) {
        compiler.watch(
          {
            aggregateTimeout: 2000
          },
          () => {}
        )
        initCompilerLog({
          compiler,
          response: iRes,
          env
        })
      } else {
        iRes.trigger('msg', ['info', [LANG.OPTIMIZE.USE_DEV_SERVER]])
        const serverPort = env.port || yylConfig?.localserver?.port || 5000
        extOs.checkPort(serverPort).then((canUse) => {
          if (!canUse) {
            iRes.trigger('msg', [
              'error',
              [`${LANG.OPTIMIZE.DEV_SERVER_PORT_OCCUPIED}: ${serverPort}`]
            ])
            iRes.trigger('progress', ['finished'])
            return
          }

          try {
            const devServer = new WebpackDevServer(
              compiler as any,
              {
                ...(wConfig.devServer as DevServerConfiguration)
              } as any
            )
            devServer.listen(serverPort, (err) => {
              if (err) {
                iRes.trigger('msg', ['error', [LANG.OPTIMIZE.DEV_SERVER_START_FAIL, err]])
              } else {
                iRes.trigger('msg', ['success', [LANG.OPTIMIZE.DEV_SERVER_START_SUCCESS]])
              }
            })

            initCompilerLog({
              compiler,
              response: iRes,
              env
            })
          } catch (err) {
            iRes.trigger('msg', ['error', [LANG.OPTIMIZE.DEV_SERVER_START_FAIL, err]])
          }
        })
      }
      return opzer
    }
  }
  return opzer
}
