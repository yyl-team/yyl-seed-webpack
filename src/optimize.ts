import fs from 'fs'
import path from 'path'
import extOs from 'yyl-os'
import SeedResponse, { ResponseFn } from 'yyl-seed-response'
import { SeedOptimize, SeedOptimizeOption, SeedOptimizeResult } from 'yyl-seed-base'
import { ProgressPlugin, webpack } from 'webpack'
import { merge } from 'webpack-merge'
import { buildWConfig, envInit, toCtx, initCompilerLog } from './util'
import { LANG, PLUGIN_NAME } from './const'
import WebpackDevServer from 'webpack-dev-server'
import { initMiddleWare } from 'yyl-base-webpack-config'

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
    iRes.trigger('msg', ['info', [LANG.OPTIMIZE.CHECK_SEED_PKG_START]])
    await extOs.installPackage(pkgPath, {
      production: false,
      loglevel: env.silent ? 'silent' : 'info',
      useYarn: !!yylConfig.yarn
    })
    iRes.trigger('msg', ['info', [LANG.OPTIMIZE.CHECK_SEED_PKG_FINISHED]])
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
      stats: 'none',
      infrastructureLogging: {
        level: 'none'
      },
      plugins: [
        new ProgressPlugin({
          activeModules: true,
          handler(percentage, ...args) {
            iRes.trigger('progress', [percentage, 'info', args])
          }
        })
      ]
    })
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
      iRes.trigger('progress', ['start', 'info', [LANG.OPTIMIZE.WEBPACK_RUN_START]])
      initCompilerLog({
        compiler,
        response: iRes,
        env
      })

      compiler.run(() => undefined)
      return opzer
    },

    watch() {
      iRes.trigger('progress', ['start'])
      iRes.trigger('msg', ['info', [LANG.OPTIMIZE.WEBPACK_RUN_START]])
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

        // 项目自带 express
        if (usePjServer) {
          compiler.watch(
            {
              aggregateTimeout: 2000
            },
            () => {}
          )
        } else {
          try {
            const devServer = new WebpackDevServer(compiler, {
              ...wConfig.devServer
            } as any)
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
            iRes.trigger('progress', ['finished'])
          }
        }
      })

      return opzer
    }
  }
  return opzer
}
