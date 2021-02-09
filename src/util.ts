import path from 'path'
import { YylConfig, Env } from 'yyl-config-types'
import SeedResponse from 'yyl-seed-response'
import { wConfig as baseWConfig } from './config/base'
import { wConfig as vue2WConfig } from './config/vue2'
import { Compiler, Compilation, Configuration } from 'webpack'
import { HOOK_NAME } from './const'
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
      pjWConfig = pjWConfig(env, yylConfig)
    }
    return merge(wConfig, pjWConfig)
  } else {
    return wConfig
  }
}

export interface InitCompilerLogOption {
  compiler: Compiler
  response: SeedResponse
  env: Env
}

export interface LogCache {
  [key: string]: boolean
}

export function initCompilerLog(option: InitCompilerLogOption) {
  const { compiler, response, env } = option
  const { output } = compiler.options
  const logCache: LogCache = {}
  const compilationLogIt = (compilation: Compilation) => {
    compilation.chunks.forEach((chunk) => {
      chunk.files.forEach((fName) => {
        const iPath = path.resolve(output.path || '', fName)
        if (!logCache[iPath]) {
          response.trigger('msg', ['create', iPath])
          logCache[iPath] = true
        }
      })
    })
    const stats = compilation.getStats().toJson({
      all: false,
      assets: true
    })
    if (stats.assets) {
      stats.assets.forEach((asset) => {
        const iPath = path.resolve(output.path || '', asset.name)
        if (!logCache[iPath]) {
          response.trigger('msg', ['create', iPath])
          logCache[iPath] = true
        }
      })
    }
    compiler.hooks.afterCompile.tap(HOOK_NAME, compilationLogIt)
    compiler.hooks.emit.tap(HOOK_NAME, compilationLogIt)

    compiler.hooks.done.tap(HOOK_NAME, (stats) => {
      const statsInfo = stats.toJson({
        all: false,
        assets: true,
        errors: true,
        warnings: true,
        logging: 'warn'
      })

      const logStr = stats.toString({
        // 使构建过程更静默无输出
        chunks: false,
        // 在控制台展示颜色
        colors: true
      })

      response.trigger(
        'msg',
        ['info'].concat(logStr.split(/[\r\n]+/).map((str) => str.trim().replace(/\s+/g, ' ')))
      )

      if (statsInfo.warnings) {
        statsInfo.warnings.forEach((er) => {
          response.trigger('msg', ['warn', env.logLevel === 2 ? er : er.message || er])
        })
      }

      if (statsInfo.errors) {
        statsInfo.errors.forEach((er) => {
          response.trigger('msg', ['error', env.logLevel === 2 ? er : er.message || er])
        })
      }

      if (statsInfo.logging) {
        Object.keys(statsInfo.logging).forEach((pluginName) => {
          if (statsInfo.logging) {
            const { entries } = statsInfo.logging[pluginName]
            if (entries && entries.length) {
              entries.forEach((logInfo) => {
                if (logInfo.type === 'warn') {
                  response.trigger('msg', ['warn', pluginName, logInfo.message])
                } else if (logInfo.type === 'error') {
                  response.trigger('msg', ['error', pluginName, logInfo.message])
                }
              })
            }
          }
        })
      }

      response.trigger('finished', [])
    })
  }
}
