import { Env, YylConfig } from 'yyl-config-types';
export interface WConfigOption {
    env: Env;
    yylConfig: YylConfig;
}
export declare function wConfig(option: WConfigOption): import("webpack").Configuration;
