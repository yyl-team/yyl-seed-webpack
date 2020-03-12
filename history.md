# 版本信息
## 2.0.19 (2020-03-12)
* fix: 修复 devServer 参数错误问题 livereload -> liveReload
* fix: 修复 在没有启动 hmr 模式情况下， 控制台依然显示 hmr 的问题

## 2.0.18 (2020-03-11)
* feat: log 调整

## 2.0.17 (2020-03-10)
* feat: log 调整

## 2.0.16 (2020-03-10)
* feat: log 调整

## 2.0.15 (2020-03-10)
* feat: log 调整

## 2.0.14 (2020-03-10)
* feat: 优化 log
* fix: 修复 通过sugar 替换的文件 `path/to/1.png?1234#adsf` 结果不符合预期的问题

## 2.0.12 (2020-03-09)
* fix: 修复 通过sugar 替换的文件 hash 不会改变问题

## 2.0.11 (2020-03-06)
* del: 去掉 w() 方法， 改在上层 yyl 实现
* del: 去掉 d() 方法， 改在上层 yyl 实现
* del: 去掉 r() 方法， 改在上层 yyl 实现
* del: 去掉 o() 方法， 改在上层 yyl 实现


## 2.0.10 (2020-03-05)
* feat: 文件 watch 改为默认不打开 hmr 模式
* feat: 添加 `--livereload` 功能 若打开，则文件更新方式为自动刷新当前页
* feat: 添加 `--hmr` 功能 若打开，则文件更新方式为热更新
* feat: 新增 w() 方法， 等同于 `watch`
* feat: 新增 d() 方法， 等同于 `watch --proxy --hmr`
* feat: 新增 r() 方法， 等同于 `watch --proxy --remote --hmr`
* feat: 新增 o() 方法， 等同于 `all --isCommit`
* fix: 修复 执行 `--remote` 时 `hot-update` 文件 会覆盖掉入口文件, 导致 js 执行不符合预期问题

## 2.0.8 (2020-03-04)
* feat: wConfig.context 补充回来, 补全 historyApiCallback 例子

## 2.0.7 (2020-03-04)
* feat: 补充 `opzer.on` 方法

## 2.0.6 (2020-03-03)
* fix: 修复 打包 `vue2` 类型项目时会出现 inherits 模块没找到问题

## 2.0.5 (2020-03-03)
* fix: 补回 svg-inline-loader

## 2.0.4 (2020-03-03)
* feat: 新增 git 项目的测试用例
* feat: entry/*.html, *.pug 支持 process.env 变量
* fix: 修复 vue2 项目运行报错问题

## 2.0.3(2020-03-02)
* feat: 在 proxy 情况下现在可以使用 `historyApiFallback` 进行调试了
* fix: 修复 devServer 启动后 hmr 不正常问题

## 2.0.2(2020-02-26)
* feat: 现在允许定义 wConfig.devServer 属性了， 构建工具发现用户设置 后会切换到 devServer 启动服务
* feat: 整理 error 

## 2.0.1(2020-02-26)
* fix: 修复 yyl-sugar-webpack-plugin 替换结果不符合预期的bug

## 2.0.0(2020-02-25)
* feat: 发布正式版

## 2.0.0-beta7(2020-02-24)
* fix: 修复 react 项目中会提示 `isarray` 找不到的问题

## 2.0.0-beta6(2020-02-24)
* feat: 接入 `yyl-concat-webpack-plugin`, `yyl-copy-webpack-plugin`, `yyl-sugar-webpack-plugin`, `yyl-rev-webpack-plugin`
* feat: 使用 `happypack` 接入 `babel` 解析,
* feat: 整个 webpack 支持 ts
* feat: 升级 webpack 到 `4.41.6`
* feat: `node-sass` 废弃， 改用 `sass`
* feat: `uglify-webpack-plugin` 废弃， 改用 `terser-webpack-plugin`
* feat: test-case 覆盖 copy， concat， rev 用例
* feat: 单元测试框架变更 `jest` -> `mocha`
* del: 去掉 `typescript`, `react-ts-ie8` 配置项
* del: 去掉 `config.eslint` 配置项

## 1.0.0(2020-01-15)
* feat: 新增 `initPackage`
* feat: 剥离 init 部分以适配新版 yyl
* del: 去掉 `examples`, `init`

## 0.3.3(2019-12-03)
* feat: 若项目中 `pkg.dependence` 含有 `ts-loader`, `typescript` 则使用项目本身的 typescript 作为渲染

## 0.3.2(2019-11-17)
* feat: react-ts seed 添加 eslint
* fix: 修复 `react-ts` seed 下 与 `@yy/tofu-ui-react` 不兼容问题

## 0.3.1(2019-11-06)
* feat: 拆分单元测试用例
* feat: 添加 项目中 webpack.config.js type === function 的支持
* feat: 调整 example > vue2-ts seed

## 0.3.1-beta8(2019-09-20)
* feat: `vue-ts`, `vue` 模块 bugfix

## 0.3.1-beta7(2019-09-16)
* feat: 添加 @babel/polyfill 为默认模块

## 0.3.1-beta6(2019-09-11)
* feat: 调整 log

## 0.3.1-beta5(2019-09-11)
* feat: 调整 log

## 0.3.1-beta4(2019-09-11)
* feat: 调整 log

## 0.3.1-beta3(2019-09-11)
* feat: 构建信息 中文化
* feat: 优化 npm install log

## 0.3.1-beta2(2019-09-11)
* fix: 修复 配置修改后 watch 时 webpack-hot-middleware 报错问题

## 0.3.1-beta1(2019-09-10)
* fix: bugfix

## 0.3.0-beta20 (2019-09-10)
* feat: 优化配置项
* feat: 固定依赖版本

## 0.3.0-beta19 (2019-07-31)
* fix: 修复 `seed.init` `base` `react-ts` 不能正常运行问题

## 0.3.0-beta18 (2019-07-31)
* feat: 去掉 项目中的 `lodash` plugins
* feat: 将 jest/test 进行拆分

## 0.3.0-beta16 (2019-07-30)
* fix: 补充 `commitlint`

## 0.3.0-beta16 (2019-07-25)
* fix: 修复 `webpack vue2` seed 初始化后会报错的问题

## 0.3.0-beta15 (2019-07-25)
* fix: 修复 `webpack vue2` 种子下 没有 `async_component` 模块

## 0.3.0-beta14 (2019-07-22)
* fix: `npm install tj/react-click-outside` 兼容问题

## 0.3.0-beta13 (2019-07-22)
* feat: 新增 `config.base64Limit: number` 参数，用于配置 `url-loader` limit 数值

## 0.3.0-beta11 (2019-07-19)
* feat: 调整 eslint 各插件 版本 以兼容

## 0.3.0-beta10 (2019-07-19)
* feat: 新增 `config.eslint: boolean` 参数, 用于自定义 构建时是否执行 eslint

## 0.3.0-beta9 (2019-07-19)
* feat: 新增 `config.babelrc: boolean` 参数, 用于自定义babelrc 内容

## 0.3.0-beta8 (2019-07-18)
* fix: 调整 examples 中 `tsconfig` 配置项
## 0.3.0-beta7 (2019-07-17)
* fix: 修复 url-loader 生成的 图片路径 带有 js/../images/ 这样的写法

## 0.3.0-beta5 (2019-07-12)
* feat: 添加 husky

## 0.3.0-beta4 (2019-07-12)
* feat: 去除 每个 seed 包都会 带上 eslint 的 逻辑

## 0.3.0-beta3 (2019-07-12)
* feat: 接入公司体系 tslint

## 0.3.0-beta2 (2019-07-12)
* fix: 补充 `react-ts`, `react-ts-ie8` types 文件
## 0.3.0-beta1 (2019-07-05)
* feat: 新增 `react-ts` seed
* feat: 新增 `react-ts-ie8` seed
* feat: 去掉 `seed.make` 方法
* feat: 新增 `index.d.ts`
* fix: 修复 `plugins/build-async-rev-webpack-plugins` 死循环bug
* todo: e2e test 依然存在问题，待修复

## 0.2.0 (2019-07-05)
* todo: 遗留问题 e2e test 运行上有点儿问题

## 0.2.0-beta15 (2019-06-20)
* feat: 补充 `vue2-ts` Prop 用法

## 0.2.0-beta14 (2019-06-19)
* feat: example - typescript 新增 tslint.json

## 0.2.0-beta13 (2019-06-11)
* fix: webpack postcss options browsers => overrideBrowserlist

## 0.2.0-beta12 (2019-06-11)
* feat: example/typescript 补充 `package.json`

## 0.2.0-beta10 (2019-05-31)
* feat: 似乎 绕不开 css-loader modules 问题， 正面解决

## 0.2.0-beta9 (2019-05-30)
* feat: 优化 webpack 错误信息显示

## 0.2.0-beta8 (2019-05-30)
* fix: 暂时 只有 在 typescript | vue2-ts seed 下 才会让 css-loader modules 为 true

## 0.2.0-beta7 (2019-05-30)
* fix: 先用回 ExtractTextWebpackPlugin

## 0.2.0-beta6 (2019-05-29)
* fix: 修复 css-loader 设置 module = true 后 异步引入的 样式不匹配问题

## 0.2.0-beta5 (2019-05-28)
* fix: bugfix

## 0.2.0-beta4 (2019-05-28)
* feat: 新增 `optimize-css-assets-webpack-plugin` 用于 压缩 css
* feat: 更换 css 抽离组件为 `mini-css-webpack-plugins`
* fix: 修复 `--isCommit` 下 css-loader 不正常问题


## 0.2.0-beta3 (2019-05-21)
* fix: 修复 编辑器会提示 `export @dec` 错误
## 0.2.0-beta2 (2019-05-18)
* fix: 修复 babel 找不到的问题

## 0.2.0-beta1 (2019-05-18)
* feat: 新增 `config.ie8` 配置项
* feat: 新增 `vue2-ts` seed
* feat: 优化 webpack 配置逻辑
* feat: 调整 typescript 构建相关逻辑

## 0.1.2-beta2 (2019-05-17)
* feat: 添加 `config.seed` 校验逻辑

## 0.1.1 (2019-05-17)
* todo: e2e test 部分 watch 存在问题， 待解决
