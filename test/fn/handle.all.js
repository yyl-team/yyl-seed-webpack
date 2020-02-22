const path = require('path')
const extFs = require('yyl-fs')
const tUtil = require('yyl-seed-test-util')
const handler = require('../handler')

const {
  linkCheck
} = require('./fn.all')

function handleAll (pjPath) {
  // + vars
  const filename =  path.basename(pjPath)
  const FRAG_PATH = path.join(__dirname, `../__frag/all-${filename}`)
  const TEST_CASE_PATH = path.join(__dirname, '../case')
  const PJ_PATH = path.join(TEST_CASE_PATH, filename)
  const TARGET_PATH = path.join(FRAG_PATH, filename)
  // - vars

  describe(`seed.all test - ${filename}`, () => {
    beforeEach(async () => {
      await tUtil.frag.init(FRAG_PATH)
      await tUtil.frag.build()
      await extFs.copyFiles(PJ_PATH, TARGET_PATH, (iPath) => {
        const rPath = path.relative(PJ_PATH, iPath)
        return !/node_modules/.test(rPath)
      })
    })

    it(`${filename} all`, async () => {
      const config = await handler.all({
        config: path.join(TARGET_PATH, 'config.js'),
        silent: true
      })

      await linkCheck(config)
    })

    it(`${filename} all --remote`, async () => {
      const config = await handler.all({
        config: path.join(TARGET_PATH, 'config.js'),
        silent: true,
        remote: true
      })

      await linkCheck(config)
    })
    
    it(`${filename} all --isCommit`, async () => {
      const config = await handler.all({
        config: path.join(TARGET_PATH, 'config.js'),
        silent: true,
        isCommit: true
      })

      await linkCheck(config)
    })

    afterEach(async () => {
      await tUtil.frag.destroy()
    })
  })
}
module.exports = {
  handleAll
}