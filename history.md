# 版本信息

## 3.1.10 (2021-08-10)

- feat: 锁定 `webpack@5.40.0`
- feat: 更新 `yyl-vue2-webpack-config@0.3.4`

## 3.1.8 (2021-08-10)

- feat: 更新 `yyl-vue2-webpack-config@0.3.2`

## 3.1.7 (2021-08-10)

- feat: add log

## 3.1.6 (2021-08-09)

- feat: 升级 `yyl-vue2-webpack-config@0.3.1`

## 3.1.5 (2021-08-09)

- feat: 兼容 `webpack/lib/rules/DescriptionDataMatcherRulePlugin` 没找到问题

## 3.1.4 (2021-07-27)

- feat: 更新 `yyl-base-webpack-config@0.3.5`
- feat: 对齐 esbuild 下 postcss 插件

## 3.1.3 (2021-07-14)

- feat: 更新 `yyl-base-webpack-config@0.3.4`
- fix: 修复 在不支持 ts 情况下 执行 esbuild 报错问题

## 3.1.2 (2021-07-13)

- feat: 更新 `yyl-base-webpack-config@0.3.3`
- fix: 补充 svg 处理裸机价

## 3.1.1 (2021-07-10)

- feat: 更新 `yyl-base-webpack-config@0.3.2`
- fix: 去掉多余的 log

## 3.1.0 (2021-07-09)

- feat: 新增 esbuild 模式
- feat: 更新 `yyl-base-webpack-config@0.3.1`
- feat: 更新 `yyl-vue2-webpack-config@0.3.0`

## 3.0.27 (2021-06-26)

- feat: 更新 `yyl-hander@1.3.22`

## 3.0.26 (2021-06-26)

- feat: 补充 seed 初始化时 yarn instal 的 log

## 3.0.25 (2021-06-26)

- feat: 更新 `yyl-base-webpack-config@0.2.24`
- fix: 修复生成的 无 hash 图片显示不了问题

## 3.0.24 (2021-06-26)

- feat: 更新 `yyl-base-webpack-config@0.2.22`
- feat: 更新 `yyl-vue2-webpack-config@0.2.2`
- fix: 修复 sugar 时会生成两份文件，一份没有被 sugar 另一方 已被 sugar 的问题
- feat: 修复 vue2 类型 hmr 不生效问题查明： hmr 不能在 https 下运行

## 3.0.23 (2021-06-16)

- feat: 更新 `yyl-base-webpack-config@0.2.21`
- feat: 如遇到 zepto 禁止构建并提示更换 (只针对 webpack-vue2 类型)
- feat: 通过 webpack.config.js 添加 vconsole 无效, 原因已查到： vconsole-webpack-plugins 不支持 webpack5

## 3.0.22 (2021-06-10)

- feat: 更新 `yyl-base-webpack-config@0.2.19`
- fix: 修复 px2rem 在 isCommit 情况下 处理异常问

## 3.0.21 (2021-06-07)

- fix: 修复项目 `webpack.config.js` 自定义配置文件 报错问题

## 3.0.20 (2021-06-03)

- feat: 更新 `yyl-base-webpack-config@0.2.18`
- feat: 优化 wepack watchOptions 移除 node_modules 的监听

## 3.0.19 (2021-06-03)

- feat: 更新 `yyl-base-webpack-config@0.2.17`
- fix: 修复 process && process.env && process.env.mode 判断 会报错问题
- fix: rev-mainfest -> rev-manifest

## 3.0.18 (2021-06-01)

- feat: 更新 `yyl-base-webpack-config@0.2.16`

## 3.0.17 (2021-06-01)

- fix: `webpack` 修复 px2rem 失效问题
- feat:`webpack` 支持 `entry/sub/index` 形式的入口配置
- feat: 更新 `yyl-base-webpack-config@0.2.15`

## 3.0.16 (2021-05-28)

- feat: 优化提示文案

## 3.0.15 (2021-05-28)

- feat: 兼容 项目 `webpack.config.js` 部分 webpack4 属性 `jsonpFunction`, `hotUpdateGlobal`, `chunkCallbackFunction`

## 3.0.14 (2021-05-27)

- feat: 更新 `yyl-hander@1.3.17`

## 3.0.13 (2021-05-27)

- feat: 更新 `yyl-base-webpack-config@0.2.14`
- feat: 更新 `yyl-hander@1.3.14`
- feat: 更新 `yyl-cmd-logger@0.2.1`

## 3.0.12 (2021-05-23)

- feat: 更新 `yyl-base-webpack-config@0.2.13`

## 3.0.11 (2021-05-23)

- feat: 更新 `yyl-base-webpack-config@0.2.12`

## 3.0.10 (2021-05-23)

- feat: 更新 `yyl-base-webpack-config@0.2.11`

## 3.0.9 (2021-05-23)

- feat: 更新 `yyl-base-webpack-config@0.2.10`

## 3.0.8 (2021-05-23)

- feat: 优化 log
- feat: 更新 `yyl-cmd-logger@0.2.0`
- feat: 更新 `webpack@5.37.1`
- feat: 更新 `webpack-cli@4.7.0`

## 3.0.7 (2021-05-18)

- feat: 更新 `yyl-base-webpack-config@0.2.9`

## 3.0.6 (2021-05-18)

- fix: 修复 watch 后报错问题

## 3.0.5 (2021-05-17)

- feat: 更新 `yyl-base-webpack-config@0.2.8`
- feat: 更新 `yyl-hander@1.3.10`

## 3.0.4 (2021-05-17)

- feat: 更新 `yyl-base-webpack-config@0.2.7`

## 3.0.3 (2021-05-16)

- feat: 更新 `yyl-base-webpack-config@0.2.4`

## 3.0.2 (2021-05-16)

- feat: 更新 `yyl-seed-base@0.4.1`
- feat: 更新 `yyl-base-webpack-config@0.2.3`
- feat: 更新 `yyl-config-types@0.5.3`
- feat: 更新 `yyl-hander@1.3.9`
- fix: 修复 progress 错乱问题

## 3.0.1 (2021-05-07)

- feat: 更新 `yyl-base-webpack-config@0.2.0`
- feat: 更新 `yyl-config-types@0.5.1`
- feat: 更新 `yyl-seed-base@0.3.0`
- feat: 更新 `yyl-vue2-webpack-plugin@0.2.0`

## 2.6.5 (2021-03-29)

- fix: 修复 remote 模式，在 windows 下 映射静态资源失败问题

## 2.6.4 (2021-01-27)

- fix: 更新 browserlist

## 2.6.3 (2020-12-28)

- feat: 更新 webpack.base.js alias 依赖 新增 `base64-js`, `ieee754`

## 2.6.2 (2020-11-24)

- feat: 更新 `yyl-rev-webpack-plugin@0.1.7` 优化 rev remote 时 的 log 显示

## 2.6.1 (2020-11-24)

- feat: 更新 `yyl-rev-webpack-plugin@0.1.6` 优化 rev remote 时 的 log 显示

## 2.6.0 (2020-10-30)

- feat: 新增 `config.urlLoaderMatch` 属性, 用于配置 其他 需要用到 url-loader 的文件

## 2.5.16 (2020-10-25)

- feat: 禁掉 publish 时 会生成 sourcemap 的操作

## 2.5.15 (2020-10-10)

- feat: 完善 d.ts

## 2.5.14 (2020-09-28)

- feat: 兼容 webpack.devServer.historyApiFallback.rewrite 配置项
- fix: 修复 启动 `webpack.devServer` 时，如项目未安装 webpack 会报错的问题

## 2.5.13 (2020-09-27)

- del: 去掉多余的依赖

## 2.5.12 (2020-09-27)

- feat: 补充 `license`

## 2.5.11 (2020-09-27)

- feat: 添加 `aquaman` 例子
- del: 去掉多余的 `package-lock.json`

## 2.5.10 (2020-08-31)

- feat: 兼容 当 `yconfig.localserver.entry` 时 writeDisk 自动设为 true

## 2.5.9 (2020-07-22)

- del: 去掉没用的依赖 `node-sass`

## 2.5.8 (2020-07-22)

- fix: 兼容 node@14

## 2.5.7 (2020-05-14)

- feat: update `yyl-sugar-webpack-plugin@0.1.14`
- fix: 修复 当 js 有 sugar 需要替换，而正好 html 引入了这个 js 时，会出现 hash 不对的情况

## 2.5.6 (2020-04-23)

- feat: 运行 webpack-dev-server 不再需要项目内安装 `webpack`, `webpack-dev-server` 了

## 2.5.5 (2020-04-23)

- fix: 修复 js 不会只想 babel-loader 问题

## 2.5.4 (2020-04-21)

- feat: 优化 端口被占用时文案

## 2.5.2 (2020-04-21)

- fix: 修复 构建时 5000 端口会报错问题
- fix: 修复配置 --port 4000 时 hmr 依然指向 5000 的问题

## 2.5.1 (2020-04-20)

- del: 去掉 `config.tsLoaderIncludes` 参数 (没必要)

## 2.5.0 (2020-04-20)

- feat: 新增 `config.babelLoaderIncludes` 参数
- feat: 新增 `config.tsLoaderIncludes` 参数

## 2.4.4 (2020-04-16)

- feat: 调整 pop 提示信息

## 2.4.3 (2020-04-16)

- feat: 调整 pop 提示信息

## 2.4.2 (2020-04-16)

- feat: 支持通过 `env.port` 配置 本地服务 port (`webpack-dev-server` 激活时)

## 2.4.1 (2020-04-16)

- fix: 当使用 `webpack-dev-server` 并进行 https watch 时， 暂时屏蔽掉 hmr 和 hotrerload(有报错)

## 2.4.0 (2020-04-09)

- feat: 升级 `yyl-hander@0.10.0`
- feat: 升级 `yyl-os@0.11.0`
- feat: 支持 `config.yarn` 配置项
- feat: 调整开发工具 `prettier` `eslint` 配置

## 2.3.1 (2020-03-31)

- fix: 修复在启用 `webpack-dev-server` 时， 若 `webpack.config.js` 返回为 function 时，仍旧会启动 `webpack-hot-middleware` 插件的问题

## 2.3.0 (2020-03-26)

- feat: style-loader 现会自动配置 `data-module` 为 `yConfig.name` || `inline-style`

## 2.2.2 (2020-03-25)

- feat: 更新 `yyl-env-pop-webpack-plugin@0.1.5`
- feat: 兼容同时出现多个情况
- feat: 优化 pop 文案

## 2.2.1 (2020-03-25)

- feat: 更新 `yyl-env-pop-webpack-plugin@0.1.4`
- fix: 修复插入 pop 模块后，主程序 export 不能问题
- feat: pop 模块改为输入 `--tips` 后才出现
- feat: 新增 `--writeToDisk` 参数, 用于控制 构建是否写入硬盘

## 2.2.0 (2020-03-19)

- feat: 添加环境提示 pop 注入到 entry 里面

## 2.1.1 (2020-03-16)

- fix: 修复 构建工具在 `windows` 上执行路径不对问题

## 2.1.0 (2020-03-15)

- feat: 构建工具 默认设置 `writeToDisk: false`, `iEnv.remote`, `iEnv.isCommit` 时为 `true`

## 2.0.19 (2020-03-12)

- fix: 修复 devServer 参数错误问题 livereload -> liveReload
- fix: 修复 在没有启动 hmr 模式情况下， 控制台依然显示 hmr 的问题

## 2.0.18 (2020-03-11)

- feat: log 调整

## 2.0.17 (2020-03-10)

- feat: log 调整

## 2.0.16 (2020-03-10)

- feat: log 调整

## 2.0.15 (2020-03-10)

- feat: log 调整

## 2.0.14 (2020-03-10)

- feat: 优化 log
- fix: 修复 通过 sugar 替换的文件 `path/to/1.png?1234#adsf` 结果不符合预期的问题

## 2.0.12 (2020-03-09)

- fix: 修复 通过 sugar 替换的文件 hash 不会改变问题

## 2.0.11 (2020-03-06)

- del: 去掉 w() 方法， 改在上层 yyl 实现
- del: 去掉 d() 方法， 改在上层 yyl 实现
- del: 去掉 r() 方法， 改在上层 yyl 实现
- del: 去掉 o() 方法， 改在上层 yyl 实现

## 2.0.10 (2020-03-05)

- feat: 文件 watch 改为默认不打开 hmr 模式
- feat: 添加 `--livereload` 功能 若打开，则文件更新方式为自动刷新当前页
- feat: 添加 `--hmr` 功能 若打开，则文件更新方式为热更新
- feat: 新增 w() 方法， 等同于 `watch`
- feat: 新增 d() 方法， 等同于 `watch --proxy --hmr`
- feat: 新增 r() 方法， 等同于 `watch --proxy --remote --hmr`
- feat: 新增 o() 方法， 等同于 `all --isCommit`
- fix: 修复 执行 `--remote` 时 `hot-update` 文件 会覆盖掉入口文件, 导致 js 执行不符合预期问题

## 2.0.8 (2020-03-04)

- feat: wConfig.context 补充回来, 补全 historyApiCallback 例子

## 2.0.7 (2020-03-04)

- feat: 补充 `opzer.on` 方法

## 2.0.6 (2020-03-03)

- fix: 修复 打包 `vue2` 类型项目时会出现 inherits 模块没找到问题

## 2.0.5 (2020-03-03)

- fix: 补回 svg-inline-loader

## 2.0.4 (2020-03-03)

- feat: 新增 git 项目的测试用例
- feat: entry/_.html, _.pug 支持 process.env 变量
- fix: 修复 vue2 项目运行报错问题

## 2.0.3(2020-03-02)

- feat: 在 proxy 情况下现在可以使用 `historyApiFallback` 进行调试了
- fix: 修复 devServer 启动后 hmr 不正常问题

## 2.0.2(2020-02-26)

- feat: 现在允许定义 wConfig.devServer 属性了， 构建工具发现用户设置 后会切换到 devServer 启动服务
- feat: 整理 error

## 2.0.1(2020-02-26)

- fix: 修复 yyl-sugar-webpack-plugin 替换结果不符合预期的 bug

## 2.0.0(2020-02-25)

- feat: 发布正式版

## 2.0.0-beta7(2020-02-24)

- fix: 修复 react 项目中会提示 `isarray` 找不到的问题

## 2.0.0-beta6(2020-02-24)

- feat: 接入 `yyl-concat-webpack-plugin`, `yyl-copy-webpack-plugin`, `yyl-sugar-webpack-plugin`, `yyl-rev-webpack-plugin`
- feat: 使用 `happypack` 接入 `babel` 解析,
- feat: 整个 webpack 支持 ts
- feat: 升级 webpack 到 `4.41.6`
- feat: `node-sass` 废弃， 改用 `sass`
- feat: `uglify-webpack-plugin` 废弃， 改用 `terser-webpack-plugin`
- feat: test-case 覆盖 copy， concat， rev 用例
- feat: 单元测试框架变更 `jest` -> `mocha`
- del: 去掉 `typescript`, `react-ts-ie8` 配置项
- del: 去掉 `config.eslint` 配置项

## 1.0.0(2020-01-15)

- feat: 新增 `initPackage`
- feat: 剥离 init 部分以适配新版 yyl
- del: 去掉 `examples`, `init`

## 0.3.3(2019-12-03)

- feat: 若项目中 `pkg.dependence` 含有 `ts-loader`, `typescript` 则使用项目本身的 typescript 作为渲染

## 0.3.2(2019-11-17)

- feat: react-ts seed 添加 eslint
- fix: 修复 `react-ts` seed 下 与 `@yy/tofu-ui-react` 不兼容问题

## 0.3.1(2019-11-06)

- feat: 拆分单元测试用例
- feat: 添加 项目中 webpack.config.js type === function 的支持
- feat: 调整 example > vue2-ts seed

## 0.3.1-beta8(2019-09-20)

- feat: `vue-ts`, `vue` 模块 bugfix

## 0.3.1-beta7(2019-09-16)

- feat: 添加 @babel/polyfill 为默认模块

## 0.3.1-beta6(2019-09-11)

- feat: 调整 log

## 0.3.1-beta5(2019-09-11)

- feat: 调整 log

## 0.3.1-beta4(2019-09-11)

- feat: 调整 log

## 0.3.1-beta3(2019-09-11)

- feat: 构建信息 中文化
- feat: 优化 npm install log

## 0.3.1-beta2(2019-09-11)

- fix: 修复 配置修改后 watch 时 webpack-hot-middleware 报错问题

## 0.3.1-beta1(2019-09-10)

- fix: bugfix

## 0.3.0-beta20 (2019-09-10)

- feat: 优化配置项
- feat: 固定依赖版本

## 0.3.0-beta19 (2019-07-31)

- fix: 修复 `seed.init` `base` `react-ts` 不能正常运行问题

## 0.3.0-beta18 (2019-07-31)

- feat: 去掉 项目中的 `lodash` plugins
- feat: 将 jest/test 进行拆分

## 0.3.0-beta16 (2019-07-30)

- fix: 补充 `commitlint`

## 0.3.0-beta16 (2019-07-25)

- fix: 修复 `webpack vue2` seed 初始化后会报错的问题

## 0.3.0-beta15 (2019-07-25)

- fix: 修复 `webpack vue2` 种子下 没有 `async_component` 模块

## 0.3.0-beta14 (2019-07-22)

- fix: `npm install tj/react-click-outside` 兼容问题

## 0.3.0-beta13 (2019-07-22)

- feat: 新增 `config.base64Limit: number` 参数，用于配置 `url-loader` limit 数值

## 0.3.0-beta11 (2019-07-19)

- feat: 调整 eslint 各插件 版本 以兼容

## 0.3.0-beta10 (2019-07-19)

- feat: 新增 `config.eslint: boolean` 参数, 用于自定义 构建时是否执行 eslint

## 0.3.0-beta9 (2019-07-19)

- feat: 新增 `config.babelrc: boolean` 参数, 用于自定义 babelrc 内容

## 0.3.0-beta8 (2019-07-18)

- fix: 调整 examples 中 `tsconfig` 配置项

## 0.3.0-beta7 (2019-07-17)

- fix: 修复 url-loader 生成的 图片路径 带有 js/../images/ 这样的写法

## 0.3.0-beta5 (2019-07-12)

- feat: 添加 husky

## 0.3.0-beta4 (2019-07-12)

- feat: 去除 每个 seed 包都会 带上 eslint 的 逻辑

## 0.3.0-beta3 (2019-07-12)

- feat: 接入公司体系 tslint

## 0.3.0-beta2 (2019-07-12)

- fix: 补充 `react-ts`, `react-ts-ie8` types 文件

## 0.3.0-beta1 (2019-07-05)

- feat: 新增 `react-ts` seed
- feat: 新增 `react-ts-ie8` seed
- feat: 去掉 `seed.make` 方法
- feat: 新增 `index.d.ts`
- fix: 修复 `plugins/build-async-rev-webpack-plugins` 死循环 bug
- todo: e2e test 依然存在问题，待修复

## 0.2.0 (2019-07-05)

- todo: 遗留问题 e2e test 运行上有点儿问题

## 0.2.0-beta15 (2019-06-20)

- feat: 补充 `vue2-ts` Prop 用法

## 0.2.0-beta14 (2019-06-19)

- feat: example - typescript 新增 tslint.json

## 0.2.0-beta13 (2019-06-11)

- fix: webpack postcss options browsers => overrideBrowserlist

## 0.2.0-beta12 (2019-06-11)

- feat: example/typescript 补充 `package.json`

## 0.2.0-beta10 (2019-05-31)

- feat: 似乎 绕不开 css-loader modules 问题， 正面解决

## 0.2.0-beta9 (2019-05-30)

- feat: 优化 webpack 错误信息显示

## 0.2.0-beta8 (2019-05-30)

- fix: 暂时 只有 在 typescript | vue2-ts seed 下 才会让 css-loader modules 为 true

## 0.2.0-beta7 (2019-05-30)

- fix: 先用回 ExtractTextWebpackPlugin

## 0.2.0-beta6 (2019-05-29)

- fix: 修复 css-loader 设置 module = true 后 异步引入的 样式不匹配问题

## 0.2.0-beta5 (2019-05-28)

- fix: bugfix

## 0.2.0-beta4 (2019-05-28)

- feat: 新增 `optimize-css-assets-webpack-plugin` 用于 压缩 css
- feat: 更换 css 抽离组件为 `mini-css-webpack-plugins`
- fix: 修复 `--isCommit` 下 css-loader 不正常问题

## 0.2.0-beta3 (2019-05-21)

- fix: 修复 编辑器会提示 `export @dec` 错误

## 0.2.0-beta2 (2019-05-18)

- fix: 修复 babel 找不到的问题

## 0.2.0-beta1 (2019-05-18)

- feat: 新增 `config.ie8` 配置项
- feat: 新增 `vue2-ts` seed
- feat: 优化 webpack 配置逻辑
- feat: 调整 typescript 构建相关逻辑

## 0.1.2-beta2 (2019-05-17)

- feat: 添加 `config.seed` 校验逻辑

## 0.1.1 (2019-05-17)

- todo: e2e test 部分 watch 存在问题， 待解决
