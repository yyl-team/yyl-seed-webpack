import { optimize, Optimize } from './optimize'
const pkg = require('../package.json')

export interface Entry {
  /** seed 名称 */
  name: string
  /** 版本 */
  version: string
  /** 所在地址 */
  path: string
  /** 构建处理 */
  optimize: Optimize
  /** seed 包初始化用对象 */
  initPackage: {
    default: string[]
    yy: string[]
  }
}

const entry: Entry = {
  name: 'webpack',
  version: pkg.version,
  path: __dirname,
  optimize,
  initPackage: {
    default: ['init-me-seed-yyl-webpack'],
    yy: ['@yy/init-me-seed-yyl-react', '@yy/init-me-seed-yyl-vue']
  }
}

export default entry
module.exports = entry
