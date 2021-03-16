import { Env, YylConfig } from 'yyl-config-types';
import { WebpackOptionsNormalized } from 'webpack';
export interface WConfigOption {
    env: Env;
    yylConfig: YylConfig;
}
export declare function wConfig(option: WConfigOption): WebpackOptionsNormalized;
