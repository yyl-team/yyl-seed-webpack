import { Env, YylConfig } from 'yyl-config-types'
import { initYylBaseConfig } from 'yyl-base-webpack-config'
import { commonConfig } from './common'
import { merge } from 'webpack-merge'
export interface WConfigOption {
  env: Env
  yylConfig: YylConfig
}
// TODO: ProgressPlugin
export function wConfig(option: WConfigOption) {
  const { env, yylConfig } = option
  return merge(
    initYylBaseConfig({
      context: yylConfig?.alias?.dirname || process.cwd(),
      env,
      alias: yylConfig.alias,
      yylConfig
    }),
    commonConfig({
      env,
      yylConfig
    })
  )
}
