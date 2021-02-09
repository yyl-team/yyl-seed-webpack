import { Env, YylConfig } from 'yyl-config-types'
import initBaseWebpackConfig from 'yyl-base-webpack-config'
export interface WConfigOption {
  env: Env
  yylConfig: YylConfig
}
export function wConfig(option: WConfigOption) {
  const { env, yylConfig } = option
  return initBaseWebpackConfig({
    context: yylConfig?.alias?.dirname || process.cwd(),
    env,
    alias: yylConfig.alias,
    yylConfig
  })
}
