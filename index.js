const opzer = require('./lib/optimize.js')
const pkg = require('./package.json')
const cmd = {
  name: 'webpack',
  version: pkg.version,
  path: __dirname,
  optimize: opzer,
  initPackage: {
    default: ['init-me-seed-yyl-webpack'],
    yy: ['@yy/init-me-seed-yyl-react', '@yy/init-me-seed-yyl-vue']
  }
}

module.exports = cmd
