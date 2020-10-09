import { YylConfig, Env } from 'yyl-config-types'
type Callback = (...args: any[]) => any;

interface Res {
  /** 事件绑定 */
  on(eventName: string, fn: () => void): this;
  /** 事件触发 */
  trigger(eventName: string, args: any[]): this;
}

interface Opzer {
  /** watch */
  watch(): Res;
  /** 打包 */
  all(): Res;
  /** 获取 runtime config */
  getConfigSync(): YylConfig;
  /** 事件句柄 */
  response: Res;
  /** 禁止 热刷新 */
  ignoreLiveReload: boolean;
  /** 初始化 server 中间件 */
  initServerMiddleWare(app: any): void;
  /** 事件绑定 */
  on(eventName: string, fn: Callback): this;
}

interface OptimizeOption {
  /** yyl.config */
  config: YylConfig 
  /** 项目根目录 */
  root: string
  /** watch|all */
  ctx?: string
  /** cli 参数 */
  iEnv?: Env
}

interface Optimize {
  (option: OptimizeOption): Promise<Opzer>;
  /** 允许执行的方法 */
  handles: string[];
  /** 是否自带server */
  withServer: boolean;
}

interface Cmd {
  /** seed 包名称 */
  name: string,
  /** 版本 */
  version: string,
  /** 当前目录 */
  path: string,
  /** 压缩句柄 */
  optimize: Optimize,
  /** 初始化配置 */
  initPackage: {
    /** 外网 seed name */
    default: string[]
    /** 内网 seed name */
    yy: string[]
  };
}
declare const cmd: Cmd;
export=cmd;
