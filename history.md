# 版本信息
# 0.3.0-beta8 (2019-07-18)
* [FIX] 调整 examples 中 `tsconfig` 配置项
# 0.3.0-beta7 (2019-07-17)
* [FIX] 修复 url-loader 生成的 图片路径 带有 js/../images/ 这样的写法

# 0.3.0-beta5 (2019-07-12)
* [ADD] 添加 husky

# 0.3.0-beta4 (2019-07-12)
* [DEL] 去除 每个 seed 包都会 带上 eslint 的 逻辑

# 0.3.0-beta3 (2019-07-12)
* [EDIT] 接入公司体系 tslint

# 0.3.0-beta2 (2019-07-12)
* [FIX] 补充 `react-ts`, `react-ts-ie8` types 文件
# 0.3.0-beta1 (2019-07-05)
* [ADD] 新增 `react-ts` seed
* [ADD] 新增 `react-ts-ie8` seed
* [DEL] 去掉 `seed.make` 方法
* [ADD] 新增 `index.d.ts`
* [FIX] 修复 `plugins/build-async-rev-webpack-plugins` 死循环bug
* [TODO] e2e test 依然存在问题，待修复

## 0.2.0 (2019-07-05)
* [TODO] 遗留问题 e2e test 运行上有点儿问题

## 0.2.0-beta15 (2019-06-20)
* [ADD] 补充 `vue2-ts` Prop 用法

## 0.2.0-beta14 (2019-06-19)
* [ADD] example - typescript 新增 tslint.json

## 0.2.0-beta13 (2019-06-11)
* [FIX] webpack postcss options browsers => overrideBrowserlist

## 0.2.0-beta12 (2019-06-11)
* [ADD] example/typescript 补充 `package.json`

## 0.2.0-beta10 (2019-05-31)
* [EDIT] 似乎 绕不开 css-loader modules 问题， 正面解决

## 0.2.0-beta9 (2019-05-30)
* [EDIT] 优化 webpack 错误信息显示

## 0.2.0-beta8 (2019-05-30)
* [FIX] 暂时 只有 在 typescript | vue2-ts seed 下 才会让 css-loader modules 为 true

## 0.2.0-beta7 (2019-05-30)
* [FIX] 先用回 ExtractTextWebpackPlugin

## 0.2.0-beta6 (2019-05-29)
* [FIX] 修复 css-loader 设置 module = true 后 异步引入的 样式不匹配问题

## 0.2.0-beta5 (2019-05-28)
* [FIX] bugfix

## 0.2.0-beta4 (2019-05-28)
* [ADD] 新增 `optimize-css-assets-webpack-plugin` 用于 压缩 css
* [EDIT] 更换 css 抽离组件为 `mini-css-webpack-plugins`
* [FIX] 修复 `--isCommit` 下 css-loader 不正常问题


## 0.2.0-beta3 (2019-05-21)
* [FIX] 修复 编辑器会提示 `export @dec` 错误
## 0.2.0-beta2 (2019-05-18)
* [FIX] 修复 babel 找不到的问题

## 0.2.0-beta1 (2019-05-18)
* [ADD] 新增 `config.ie8` 配置项
* [ADD] 新增 `vue2-ts` seed
* [EDIT] 优化 webpack 配置逻辑
* [EDIT] 调整 typescript 构建相关逻辑

## 0.1.2-beta2 (2019-05-17)
* [ADD] 添加 `config.seed` 校验逻辑

## 0.1.1 (2019-05-17)
* [TODO] e2e test 部分 watch 存在问题， 待解决
