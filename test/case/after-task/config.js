const path = require('path')

// + vars
const SRC_ROOT = './src'
// - vars

// + setting
const setting = {
  localserver: {
    root: './dist',
    port: 5000
  },
  dest: {
    basePath: '/pc',
    jsPath: 'js',
    jslibPath: 'js/lib',
    cssPath: 'css',
    htmlPath: 'html',
    imagesPath: 'images',
    tplPath: 'tpl',
    revPath: 'assets'
  }
}
// - setting

const DEST_BASE_PATH = path.join(setting.localserver.root, setting.dest.basePath)

const config = {
  workflow: 'webpack',
  // + configBase
  platform: 'pc',
  // - configBase
  seed: 'react-ts',
  px2rem: false,
  ie8: false,
  base64Limit: 3000,
  localserver: setting.localserver,
  dest: setting.dest,
  concat: {
    '{$jsDest}/shim.js': [
      '{$srcRoot}/js/lib/shim/es5-shim.min.js',
      '{$srcRoot}/js/lib/shim/es5-sham.min.js',
      '{$srcRoot}/js/lib/shim/json3.min.js',
      '{$srcRoot}/js/lib/shim/es6-shim.min.js',
      '{$srcRoot}/js/lib/shim/es6-sham.min.js'
    ]
  },
  resource: {
    'src/source/html/demo.html': '{$htmlDest}/demo.html',
    'src/source/html/anything.html': '{$htmlDest}/anything.html',
    'src/source/js': '{$jsDest}',
    'src/source/css': '{$cssDest}',
    'src/source/images': '{$imagesDest}'
  },
  providePlugin: {
    '$': 'jquery'
  },
  alias: {
    // 输出目录中 到 html, js, css, image 层 的路径
    'root': DEST_BASE_PATH,
    // rev 输出内容的相对地址
    'revRoot': DEST_BASE_PATH,
    // dest 地址
    'destRoot': setting.localserver.root,
    // src 地址
    'srcRoot': SRC_ROOT,
    // 项目根目录
    'dirname': './',
    // js 输出地址
    'jsDest': path.join(DEST_BASE_PATH, setting.dest.jsPath),
    // js lib 输出地址
    'jslibDest': path.join(DEST_BASE_PATH, setting.dest.jslibPath),
    // html 输出地址
    'htmlDest': path.join(DEST_BASE_PATH, setting.dest.htmlPath),
    // css 输出地址
    'cssDest': path.join(DEST_BASE_PATH, setting.dest.cssPath),
    // images 输出地址
    'imagesDest': path.join(DEST_BASE_PATH, setting.dest.imagesPath),
    // assets 输出地址
    'revDest': path.join(DEST_BASE_PATH, setting.dest.revPath),
    // tpl 输出地址
    'tplDest': path.join(DEST_BASE_PATH, setting.dest.tplPath)
    // webpackconfig 中的 alias
    // + yyl make
    // - yyl make
  },
  // + configCommit
  commit: {
    hostname: '/',
    revAddr: `/${setting.dest.basePath}/${setting.dest.revPath}/rev-manifest.json`
  }
  // - configCommit
}

module.exports = config
