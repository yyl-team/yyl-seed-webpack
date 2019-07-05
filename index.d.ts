type callback = (...args: any[]) => any;
type anyObject = { [key: string]: any};

interface Ilocalserver {
  root: string;
  [key: string]: any;
}

interface ICommit {
  hostname: string;
  revAddr: string;
  [key: string]: any;
}

interface IConfig {
  [key: string]: any;
  seed: string;
  px2rem?: boolean;
  localserver: Ilocalserver
  dest: string;
  plugins: string[];
  alias: anyObject;
  commit: ICommit
}

interface IRes {
  on(eventName: string, fn: callback): this;
  trigger(eventName: string, args: any[]): this;
}

interface IFilter {
  COPY_FILTER: RegExp;
  EXAMPLE_FILTER: RegExp;
}

interface wInit {
  (type: string, targetPath: string): IRes;
  examples: string[];
  FILTER: IFilter;
}

interface IOpzer {
  watch(iEnv: anyObject, done: callback): IRes;
  all(iEnv: anyObject): IRes;
  getConfigSync(): IConfig;
  response: IRes;
  ignoreLiveReload: boolean;
  initServerMiddleWare(app: any): void;
}

interface wOpzer {
  (config: IConfig, root: string): IOpzer;
  handles: string[]
  withServer: boolean;
}

interface Icmd {
  name: string,
  version: string,
  path: string,
  examples: string[],
  optimize: wOpzer,
  init: wInit;
}
declare const cmd:Icmd;
export=cmd;
