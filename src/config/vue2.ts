import { Env, YylConfig } from 'yyl-config-types'
import initVue2WebpackConfig from 'yyl-vue2-webpack-config'
import { merge } from 'webpack-merge'
import { WebpackOptionsNormalized } from 'webpack'
import { commonConfig } from './common'
export interface WConfigOption {
  env: Env
  yylConfig: YylConfig
}
export function wConfig(option: WConfigOption) {
  const { env, yylConfig } = option
  return merge(
    initVue2WebpackConfig({
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
