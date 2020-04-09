// WARNING 需要 连公司 vpn 再进行测试
const path = require('path')
const fs = require('fs')
const { handleAll } = require('../fn/handle.all')
const { expect } = require('chai')

// + vars
const casePath = path.join(__dirname, '../case/yarn')
// - vars

handleAll(casePath, async ({ targetPath }) => {
  expect(fs.existsSync(path.join(targetPath, 'yarn.lock'))).to.equal(true)
})
