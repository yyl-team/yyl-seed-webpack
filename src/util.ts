import path from 'path'
import { YylConfig, Env } from 'yyl-config-types'
import SeedResponse from 'yyl-seed-response'
import { wConfig as baseWConfig } from './config/base'
import { wConfig as vue2WConfig } from './config/vue2'
import { Compiler, Compilation, Configuration, Stats } from 'webpack'
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

export interface StatDispatchOption {
  stats: Stats
  response: SeedResponse
  env: Env
}
