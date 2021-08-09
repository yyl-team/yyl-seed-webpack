import { Env, YylConfig } from 'yyl-config-types'
import { Configuration } from 'webpack'
import path from 'path'
export interface CommonConfigConfigOption {
  env: Env
  yylConfig: YylConfig
}
// TODO: ProgressPlugin
export function commonConfig(option: CommonConfigConfigOption): Configuration {
  const { env, yylConfig } = option
  return {
    resolve: {
      modules: ['node_modules'],
      fallback: {
        'url': require.resolve('url/'),
        'punycode': require.resolve('punycode/'),
        'querystring': require.resolve('querystring-es3'),
        'webpack/hot': path.join(require.resolve('webpack/hot/emitter.js'), '..'),
        'webpack/hot/emitter': require.resolve('webpack/hot/emitter.js'),
        'webpack/lib/rules/DescriptionDataMatcherRulePlugin': require.resolve(
          'webpack/lib/rules/DescriptionDataMatcherRulePlugin.js'
        ),
        'ansi-html': require.resolve('ansi-html'),
        'html-entities': require.resolve('html-entities'),
        'events': require.resolve('events/'),
        'strip-ansi': require.resolve('strip-ansi'),
        'loglevel': require.resolve('loglevel'),
        'sockjs-client/dist/sockjs': require.resolve('sockjs-client/dist/sockjs'),
        'base64-js': require.resolve('base64-js'),
        'ansi-regex': require.resolve('ansi-regex'),
        'isarray': require.resolve('isarray')
      }
    }
  }
}
