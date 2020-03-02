const path = require('path')
const extFs = require('yyl-fs')
const extOs = require('yyl-os')
const fs = require('fs')
const tUtil = require('yyl-seed-test-util')
const handler = require('../handler')

const {
  linkCheck
} = require('./fn.all')

function runAll ({ targetPath }) {
  const TARGET_PATH = targetPath
  const filename =  path.basename(targetPath)

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
}

module.exports.handleAll = function (pjPath) {
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

    runAll({ targetPath: TARGET_PATH })

    afterEach(async () => {
      await tUtil.frag.destroy()
    })
  })
}

module.exports.handleAllGit = function (gitPath) {
  const FRAG_PATH = path.join(__dirname, '../__gitcase')
  const pjName = path.basename(gitPath).replace('.git', '')
  const pjPath = path.join(FRAG_PATH, pjName)
  describe(`项目试运行 ${gitPath}`, () => {
    beforeEach(async () => {
      if (fs.existsSync(pjPath)) {
        if (fs.existsSync(path.join(pjPath, '.git'))) {
          await extOs.runSpawn('git pull', pjPath)
        } else {
          await extFs.removeFiles(pjPath, true)
          await extOs.runSpawn(`git clone ${gitPath}`, FRAG_PATH)
        }
      } else {
        await extFs.mkdirSync(FRAG_PATH)
        await extOs.runSpawn(`git clone ${gitPath}`, FRAG_PATH)
      }
      await extOs.runSpawn('git checkout master', pjPath)
    })

    runAll({ targetPath: pjPath })
  })
}

