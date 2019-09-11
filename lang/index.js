const LANG = {
  INIT: {
    TYPE_NOT_EXISTS: 'seed 类型(type) 没找到',
    TARGET_NOT_EXISTS: '目标路径(targetPath) 不存在',
    COPY_COMMON_START: '开始复制通用文件',
    COPY_COMMON_FINISHED: '复制通用文件完成',
    COPY_COMMON_ERROR: '复制通用文件发生错误',
    COPY_EXAMPLE_START: '开始复制 seed 包文件',
    COPY_EXAMPLE_FINISHED: '复制 seed 包文件完成',
    COPY_EXAMPLE_ERROR: '复制 seed 包文件发生错误',
    CREATE_DIST_START: '开始创建 dist 目录',
    CREATE_DIST_FINISHED: '创建 dist 目录完成',
    COPY_ESLINT_START: '开始复制 eslint, editorconfig',
    COPY_ESLINT_FINISHED: '复制 eslint, editorconfig 完成',
    COPY_ESLINT_ERROR: '复制 eslint, editorconfig 发生错误'
  },
  OPTIMIZE: {
    WCONFIG_TYPE_NOT_EXISTS: 'webpack.config 初始化失败, seed 不存在',
    WEBPACK_RUN_SUCCESS: 'webpack 核心流程构建完成',
    SEED_NOT_EXISTS: 'config.seed 不存在',
    SEED_NOT_SET: 'config.seed 没有配置'
  }
};

module.exports = LANG;
