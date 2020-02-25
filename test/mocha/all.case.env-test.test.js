// WARNING 需要 连公司 vpn 再进行测试
const path = require('path')
const { handleAll } = require('../fn/handle.all')

// + vars
const casePath = path.join(__dirname, '../case/env-test')
// - vars

handleAll(casePath)