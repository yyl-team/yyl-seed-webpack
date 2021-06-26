import { Env, YylConfig } from 'yyl-config-types'
import { initYylBaseConfig } from 'yyl-base-webpack-config'
import { commonConfig } from './common'
import { merge } from 'webpack-merge'
import { Configuration } from 'webpack-dev-server'
export interface WConfigOption {
  env: Env
  yylConfig: YylConfig
  devServer?: Configuration
}
// TODO: ProgressPlugin
export function wConfig(option: WConfigOption) {
  const { env, yylConfig, devServer } = option
  const r = merge(
    initYylBaseConfig({
      context: yylConfig?.alias?.dirname || process.cwd(),
      env,
      alias: yylConfig.alias,
      devServer,
      yylConfig
    }),
    commonConfig({
      env,
      yylConfig
    })
  )

  return r
}
