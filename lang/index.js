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
    WCONFIG_TYPE_NOT_EXISTS: 'webpack.config 初始化 失败, seed 不存在',
    WEBPACK_RUN_START: 'webpack 核心流程构建 开始',
    WEBPACK_RUN_SUCCESS: 'webpack 核心流程构建 完成',
    LOADING_WEBPACK_START: '正在加载 webpack 模块',
    LOADING_WEBPACK_FINISHED: 'webpack 模块 加载完成',
    SEED_NOT_EXISTS: 'config.seed 不存在',
    SEED_NOT_SET: 'config.seed 没有配置',
    CHECK_SEED_PKG_START: 'seed 依赖 开始检查',
    CHECK_SEED_PKG_FINISHED: 'yyl seed 依赖 检查完成',
    CHECK_TARGET_PKG_START: '项目依赖 开始检查 ',
    CHECK_TARGET_PKG_FINISHED: '项目依赖 检查完成'
  }
};

module.exports = LANG;
