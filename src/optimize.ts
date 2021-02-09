import fs from 'fs'
import path from 'path'
import extOs from 'yyl-os'
import SeedResponse, { ResponseFn } from 'yyl-seed-response'
import { webpack } from 'webpack'
import { YylConfig, Env } from 'yyl-config-types'
import { buildWConfig, envInit, toCtx, initCompilerLog } from './util'
import { LANG, HOOK_NAME } from './const'
import WebpackDevServer from 'webpack-dev-server'

export interface OptimizeOption {
  /** yylConfig */
  yylConfig: YylConfig
  /** 项目根目录 */
  root: string
  /** cli 传参 */
  env: Env
  /** 操作符 */
  ctx: string
}

/** optimize 返回 */
export interface OptimizeResult {
  /** 获取 yylConfig 的运行配置 */
  getConfigSync(): YylConfig
  /** 消息处理对象  */
  response: SeedResponse
  /** 项目根目录 */
  root: string
  /** 通知父应用不运行本地 server */
  ignoreServer?: boolean
  /** 消息监听 */
  on<A extends any[] = any[]>(eventName: string, fn: ResponseFn): OptimizeResult
  /** 构建 */
  all(): OptimizeResult
  /** 监听并构建 */
  watch(): OptimizeResult
  /** 可操作句柄 */
  handles: string[]
}

/** 构建函数 */
export async function optimize(option: OptimizeOption): Promise<OptimizeResult | undefined> {
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

  const compiler = webpack(wConfig)

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
      iRes.trigger('start', ['watch'])
      iRes.trigger('msg', ['info', LANG.OPTIMIZE.WEBPACK_RUN_START])
      compiler.run(() => undefined)
      initCompilerLog({ compiler, response: iRes, env })
      return opzer
    },

    watch() {
      compiler.hooks.watchRun.tap(HOOK_NAME, () => {
        iRes.trigger('clear', [])
        iRes.trigger('start', ['watch'])
        iRes.trigger('msg', ['info', LANG.OPTIMIZE.WEBPACK_RUN_START])
        if (env.livereload) {
          iRes.trigger('msg', ['info', LANG.OPTIMIZE.USE_LIVERELOAD])
        }
        if (env.hmr) {
          iRes.trigger('msg', ['info', LANG.OPTIMIZE.USE_HMR])
        }
      })

      initCompilerLog({ compiler, response: iRes, env })

      compiler.watch(
        {
          aggregateTimeout: 1000
        },
        () => undefined
      )
      return opzer
    }
  }
  return opzer
}

/** optimze 类型 */
export type Optimize = typeof optimize
