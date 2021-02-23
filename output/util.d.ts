import { YylConfig, Env } from 'yyl-config-types';
import SeedResponse from 'yyl-seed-response';
import { Compiler, Configuration, Stats } from 'webpack';
export declare function toCtx<T = any>(ctx: any): T;
export declare function checkInstall(pkgName: string, pkgPath: string): any;
export interface EventInitOption {
    env?: Env;
    yylConfig: YylConfig;
}
export declare function envInit(option: EventInitOption): Env;
export interface BuildWConfigOption {
    env: Env;
    ctx: string;
    yylConfig: YylConfig;
    /** 项目根目录 */
    root: string;
}
export declare function buildWConfig(option: BuildWConfigOption): Configuration;
export interface InitCompilerLogOption {
    compiler: Compiler;
    response: SeedResponse;
    env: Env;
}
export interface LogCache {
    [key: string]: boolean;
}
export interface StatDispatchOption {
    stats: Stats;
    response: SeedResponse;
    env: Env;
}
