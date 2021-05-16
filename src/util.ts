import path from 'path'
import { YylConfig, Env } from 'yyl-config-types'
import SeedResponse from 'yyl-seed-response'
import { wConfig as baseWConfig } from './config/base'
import { wConfig as vue2WConfig } from './config/vue2'
import { Compiler, Compilation, Configuration, Stats } from 'webpack'
import { PLUGIN_NAME, LANG } from './const'
import fs from 'fs'
import merge from 'webpack-merge'

export function toCtx<T = any>(ctx: any) {
  return ctx as T
}

export function checkInstall(pkgName: string, pkgPath: string) {
  if (fs.existsSync(pkgPath)) {
    const pkg = require(pkgPath)
    return pkg.dependencies[pkgName] || pkg.devDependencies[pkgName]
  } else {
    return false
  }
}

export interface EventInitOption {
  env?: Env
  yylConfig: YylConfig
}

export function envInit(option: EventInitOption) {
  const { yylConfig, env } = option
  const rEnv: Env = {
    ...env
  }
  if (rEnv.ver === 'remote') {
    rEnv.remote = true
  }
  if (rEnv.remote) {
    rEnv.ver = 'remote'
  }

  rEnv.staticRemotePath =
    rEnv.remote || rEnv.isCommit || rEnv.proxy
      ? yylConfig?.commit?.staticHost || yylConfig?.commit?.hostname
      : '/'
  rEnv.mainRemotePath =
    rEnv.remote || rEnv.isCommit || rEnv.proxy
      ? yylConfig?.commit?.mainHost || yylConfig?.commit?.hostname
      : '/'

  return rEnv
}

export interface BuildWConfigOption {
  env: Env
  ctx: string
  yylConfig: YylConfig
  /** 项目根目录 */
  root: string
}

export function buildWConfig(option: BuildWConfigOption): Configuration {
  const { env, ctx, yylConfig, root } = option
  const pjWConfigPath = path.join(root, 'webpack.config.js')
  let wConfig: Configuration

  switch (yylConfig.seed) {
    case 'vue2':
    case 'vue2-ts':
      wConfig = vue2WConfig({ env, yylConfig }) as Configuration
      break

    case 'base':
    case 'react-ts':
    default:
      wConfig = baseWConfig({ env, yylConfig }) as Configuration
      break
  }

  if (fs.existsSync(pjWConfigPath)) {
    let pjWConfig = require(pjWConfigPath)
    if (typeof pjWConfig === 'function') {
      try {
        pjWConfig = pjWConfig(env, { yylConfig, env })
      } catch (er) {
        try {
          // 兼容 yyl 3.0 webpack.config 写法
          pjWConfig = pjWConfig({ yylConfig, env })
        } catch (er) {
          throw new Error(`${LANG.OPTIMIZE.PARSE_WCONFIG_FAIL}: ${er.message}`)
        }
      }
    }
    return merge(pjWConfig, wConfig)
  } else {
    return wConfig
  }
}

export interface InitCompilerLogOption {
  compiler: Compiler
  response: SeedResponse
  env: Env
}
export function initCompilerLog(op: InitCompilerLogOption) {
  const { compiler, env, response } = op
  compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
    const statsInfo = stats.toJson({
      all: false,
      assets: true,
      errors: true,
      warnings: true,
      logging: 'warn'
    })

    if (statsInfo.warnings) {
      statsInfo.warnings.forEach((er) => {
        response.trigger('msg', ['warn', [er.moduleName || '', er.message]])
      })
    }

    if (statsInfo.errors) {
      statsInfo.errors.forEach((er) => {
        response.trigger('msg', ['error', [er.moduleName || '', er.message]])
      })
    }

    // 显示完整构建过程
    const logStr = stats.toString({
      chunks: false,
      color: true
    })
    response.trigger('msg', [
      'info',
      logStr.split(/[\r\n]+/).map((str) => str.trim().replace(/\s+/g, ' '))
    ])
  })
  compiler.hooks.failed.tap(PLUGIN_NAME, (err) => {
    response.trigger('msg', ['error', [LANG.OPTIMIZE.DEV_SERVER_START_FAIL, err]])
  })
}

export interface LogCache {
  [key: string]: boolean
}

export interface StatDispatchOption {
  stats: Stats
  response: SeedResponse
  env: Env
}
