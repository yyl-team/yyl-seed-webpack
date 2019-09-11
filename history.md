# 版本信息
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
