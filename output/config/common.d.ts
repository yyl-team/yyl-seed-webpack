import { Env, YylConfig } from 'yyl-config-types';
import { Configuration } from 'webpack';
export interface CommonConfigConfigOption {
    env: Env;
    yylConfig: YylConfig;
}
export declare function commonConfig(option: CommonConfigConfigOption): Configuration;
