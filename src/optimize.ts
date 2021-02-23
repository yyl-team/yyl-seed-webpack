import fs from 'fs'
import path from 'path'
import extOs from 'yyl-os'
import SeedResponse, { ResponseFn } from 'yyl-seed-response'
import { SeedOptimize, SeedOptimizeOption, SeedOptimizeResult } from 'yyl-seed-base'
import { ProgressPlugin, webpack } from 'webpack'
import { merge } from 'webpack-merge'
import { buildWConfig, envInit, toCtx } from './util'
import { LANG } from './const'
import WebpackDevServer from 'webpack-dev-server'

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
    iRes.trigger('msg', ['info', LANG.OPTIMIZE.CHECK_SEED_PKG_START])
    await extOs.installPackage(pkgPath, {
      production: false,
      loglevel: env.silent ? 'silent' : 'info',
      useYarn: !!yylConfig.yarn
    })
    iRes.trigger('msg', ['info', LANG.OPTIMIZE.CHECK_SEED_PKG_FINISHED])
  }

  // 老版本兼容
  if (toCtx<string>(yylConfig.workflow) === 'webpack-vue2') {
    yylConfig.workflow = 'webpack'
    yylConfig.seed = 'vue2'
  }
  // - 运行前校验

  const wConfig = buildWConfig({
    yylConfig,
    env,
    root,
    ctx
  })

  const compiler = webpack(
    merge(wConfig, {
      plugins: [
        new ProgressPlugin({
          activeModules: true,
          handler(percentage, message, ...args) {
            console.log(percentage, message, args)
          }
        })
      ]
    })
  )

  // 启动 devServer
  if (ctx === 'watch') {
    iRes.trigger('msg', ['info', LANG.OPTIMIZE.USE_DEV_SERVER])
    const serverPort = env.port || yylConfig?.localserver?.port || 5000
    if (!(await extOs.checkPort(serverPort))) {
      iRes.trigger('msg', ['error', `${LANG.OPTIMIZE.DEV_SERVER_PORT_OCCUPIED}: ${serverPort}`])
      return undefined
    }
    const devServer = new WebpackDevServer(compiler, wConfig.devServer)
    devServer.listen(serverPort, (err) => {
      if (err) {
        iRes.trigger('msg', ['error', LANG.OPTIMIZE.DEV_SERVER_START_FAIL, err])
      } else {
        iRes.trigger('msg', ['success', LANG.OPTIMIZE.DEV_SERVER_START_SUCCESS])
      }
    })
  }

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

    on<A extends any[] = any[]>(eventName: string, fn: ResponseFn<A>) {
      iRes.on(eventName, fn)
      return opzer
    },

    all() {
      iRes.trigger('start', ['all'])
      iRes.trigger('msg', ['info', LANG.OPTIMIZE.WEBPACK_RUN_START])
      compiler.run((er) => {
        if (er) {
          iRes.trigger('msg', ['error', env.logLevel === 2 ? er : er.message || er])
        }
        iRes.trigger('finished', [])
      })
      // initCompilerLog({ compiler, response: iRes, env })
      return opzer
    },

    watch() {
      iRes.trigger('start', ['watch'])
      iRes.trigger('msg', ['info', LANG.OPTIMIZE.WEBPACK_RUN_START])
      compiler.watch(
        {
          aggregateTimeout: 1000
        },
        (er) => {
          if (er) {
            iRes.trigger('msg', ['error', env.logLevel === 2 ? er : er.message || er])
          }
          // TODO: error handle
          iRes.trigger('finished', [])
        }
      )
      return opzer
    }
  }
  return opzer
}
