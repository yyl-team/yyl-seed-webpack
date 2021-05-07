import { optimize } from './optimize'
import { SeedEntry } from 'yyl-seed-base'

const pkg = require('../package.json')

const entry: SeedEntry = {
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
