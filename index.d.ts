type Callback = (...args: any[]) => any;
type AnyObject = { [key: string]: any};

interface Localserver {
  root: string;
  [key: string]: any;
}

interface Commit {
  hostname: string;
  revAddr: string;
  [key: string]: any;
}

interface Config {
  [key: string]: any;
  seed: string;
  px2rem?: boolean;
  localserver: localserver
  dest: string;
  plugins: string[];
  alias: AnyObject;
  commit: Commit
}

interface Res {
  on(eventName: string, fn: Callback): this;
  trigger(eventName: string, args: any[]): this;
}

interface Filter {
  COPY_FILTER: RegExp;
  EXAMPLE_FILTER: RegExp;
}

interface wInit {
  (type: string, targetPath: string): Res;
  examples: string[];
  FILTER: Filter;
}

interface Opzer {
  watch(iEnv: AnyObject, done: Callback): Res;
  all(iEnv: AnyObject): Res;
  getConfigSync(): IConfig;
  response: Res;
  ignoreLiveReload: boolean;
  initServerMiddleWare(app: any): void;
  on(eventName: string, fn: Callback): this;
}

interface Optimize {
  (config: IConfig, root: string): Opzer;
  handles: string[]
  withServer: boolean;
}

interface Icmd {
  name: string,
  version: string,
  path: string,
  examples: string[],
  optimize: Optimize,
  init: wInit;
}
declare const cmd:Icmd;
export=cmd;
