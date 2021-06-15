import path from 'path'
import { YylConfig, Env } from 'yyl-config-types'
import SeedResponse from 'yyl-seed-response'
import { wConfig as baseWConfig } from './config/base'
import { wConfig as vue2WConfig } from './config/vue2'
import { Compiler, Compilation, Configuration, Stats, WebpackOptionsNormalized } from 'webpack'
import chalk from 'chalk'
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
  response: SeedResponse
}

export function buildWConfig(option: BuildWConfigOption): WebpackOptionsNormalized {
  const { env, ctx, yylConfig, root, response } = option
  const pjWConfigPath = path.join(root, 'webpack.config.js')
  let wConfig: WebpackOptionsNormalized

  switch (yylConfig.seed) {
    case 'vue2':
    case 'vue2-ts':
      response.trigger('msg', ['success', [`${LANG.OPTIMIZE.SEED_TYPE}: ${chalk.cyan('vue2')}`]])
      wConfig = vue2WConfig({ env, yylConfig }) as WebpackOptionsNormalized
      break

    case 'base':
    case 'react-ts':
    default:
      response.trigger('msg', [
        'success',
        [`${LANG.OPTIMIZE.SEED_TYPE}: ${chalk.cyan('react-ts')}`]
      ])
      wConfig = baseWConfig({ env, yylConfig }) as WebpackOptionsNormalized
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

    // 兼容部分 wbpack4属性
    if (pjWConfig.output && pjWConfig.output.hotUpdateFunction) {
      pjWConfig.output.hotUpdateGlobal = pjWConfig.output.hotUpdateFunction
      delete pjWConfig.output.hotUpdateFunction
      response.trigger('msg', [
        'warn',
        [`${LANG.OPTIMIZE.LEGACY_KEYWORD}: pjWconfig.output.hotUpdateGlobal -> hotUpdateFunction`]
      ])
    }

    if (pjWConfig.output && pjWConfig.output.jsonpFunction) {
      pjWConfig.output.chunkLoadingGlobal = pjWConfig.output.jsonpFunction
      delete pjWConfig.output.jsonpFunction
      response.trigger('msg', [
        'warn',
        [`${LANG.OPTIMIZE.LEGACY_KEYWORD}: pjWconfig.output.jsonpFunction -> chunkLoadingGlobal`]
      ])
    }

    if (pjWConfig.output && pjWConfig.output.chunkCallbackFunction) {
      pjWConfig.output.chunkLoadingGlobal = pjWConfig.output.chunkCallbackFunction
      delete pjWConfig.output.chunkCallbackFunction
      response.trigger('msg', [
        'warn',
        [
          `${LANG.OPTIMIZE.LEGACY_KEYWORD}: pjWconfig.output.chunkCallbackFunction -> chunkLoadingGlobal`
        ]
      ])
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
      logging: 'info'
    })

    // 补充生成的文件信息
    if (statsInfo.assets) {
      statsInfo.assets.forEach((asset) => {
        if (asset.name) {
          response.trigger('msg', ['add', [path.join(compiler.outputPath, asset.name)]])
        }
      })
    }

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
