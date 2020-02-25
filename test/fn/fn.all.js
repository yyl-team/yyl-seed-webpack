const path = require('path')
const util = require('yyl-util')
const extFs = require('yyl-fs')
const fs = require('fs')
const frp = require('yyl-file-replacer')
const tUtil = require('yyl-seed-test-util')
const { expect } = require('chai')

const http = require('http')

function clearDest(config) {
  return new Promise((next) => {
    extFs.removeFiles(config.alias.destRoot).then(() => {
      next()
    })
  })
}

const linkCheck = function (config) {
  const htmlArr = extFs.readFilesSync(config.alias.destRoot, /\.html$/)
  const cssArr = extFs.readFilesSync(config.alias.destRoot, /\.css$/)
  const jsArr = extFs.readFilesSync(config.alias.destRoot, /\.js$/)

  const destRoot = config.alias.destRoot
  const LOCAL_SOURCE_REG = new RegExp(`^(${config.commit.hostname})`)
  const REMOTE_SOURCE_REG = /^(http[s]?:|\/\/\w)/
  const ABSOLUTE_SOURCE_REG = /^\/(\w)/
  const RELATIVE_SOURCE_REG = /^\./
  const NO_PROTOCOL = /^[/]{2}(\w)/

  const localSource = []
  const remoteSource = []
  const notMatchLocalSource = []

  const sourcePickup = function (iPath, dir) {
    if (iPath.match(LOCAL_SOURCE_REG)) {
      localSource.push(
        tUtil.hideUrlTail(
          util.path.join(
            path.resolve(destRoot, iPath.replace(LOCAL_SOURCE_REG, ''))
          )
        )
      )
    } else if (iPath.match(ABSOLUTE_SOURCE_REG)) {
      localSource.push(
        tUtil.hideUrlTail(
          util.path.join(
            path.resolve(destRoot, iPath.replace(LOCAL_SOURCE_REG, '$1'))
          )
        )
      )
    } else if (iPath.match(REMOTE_SOURCE_REG)) {
      remoteSource.push(iPath)
    } else if (iPath.match(RELATIVE_SOURCE_REG)) {
      localSource.push(
        tUtil.hideUrlTail(
          util.path.resolve(dir, iPath)
        )
      )
    }
  }

  htmlArr.forEach((iPath) => {
    frp.htmlPathMatch(fs.readFileSync(iPath).toString(), (mPath) => {
      sourcePickup(mPath, path.dirname(iPath))
      return mPath
    })
  })

  cssArr.forEach((iPath) => {
    frp.cssPathMatch(fs.readFileSync(iPath).toString(), (mPath) => {
      sourcePickup(mPath, path.dirname(iPath))
      return mPath
    })
  })

  jsArr.forEach((iPath) => {
    frp.jsPathMatch(fs.readFileSync(iPath).toString(), (mPath) => {
      sourcePickup(mPath, path.dirname(iPath))
      return mPath
    })
  })

  localSource.forEach((iPath) => {
    if (!fs.existsSync(iPath)) {
      notMatchLocalSource.push(iPath)
    }
  })

  return new Promise((next) => {
    let padding = remoteSource.length +  notMatchLocalSource.length
    const paddingCheck = function () {
      if (!padding) {
        next()
      }
    }

    remoteSource.forEach((iPath) => {
      var rPath = iPath
      if (rPath.match(NO_PROTOCOL)) {
        rPath = rPath.replace(NO_PROTOCOL, 'http://$1')
      }


      http.get(rPath, (res) => {
        expect([rPath, res.statusCode]).to.deep.equal([rPath, 200])
        padding--
        paddingCheck()
      })
    })

    notMatchLocalSource.forEach((iPath) => {
      var rPath = util.path.resolve(
        config.commit.hostname,
        util.path.relative(config.alias.destRoot, iPath)
      )
      if (rPath.match(NO_PROTOCOL)) {
        rPath = rPath.replace(NO_PROTOCOL, 'http://$1')
      }

      if (/^\//.test(rPath) || !rPath.match(frp.REG.IS_HTTP)) {
        padding--
        paddingCheck()
      } else {
        http.get(rPath, (res) => {
          expect([iPath, rPath, res.statusCode]).to.deep.equal([iPath, rPath, 200])
          padding--
          paddingCheck()
        })
      }
    })
    paddingCheck()
  })
}

module.exports = {
  clearDest,
  linkCheck
}
