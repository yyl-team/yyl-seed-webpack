import { Env, YylConfig } from 'yyl-config-types'
import initVue2WebpackConfig from 'yyl-vue2-webpack-config'
import { merge } from 'webpack-merge'
import { Configuration } from 'webpack-dev-server'
import { commonConfig } from './common'
export interface WConfigOption {
  env: Env
  yylConfig: YylConfig
  devServer?: Configuration
}
export function wConfig(option: WConfigOption) {
  const { env, yylConfig, devServer } = option
  const r = merge(
    initVue2WebpackConfig({
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
