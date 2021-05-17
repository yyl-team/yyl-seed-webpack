export const LANG = {
  INIT: {
    TYPE_NOT_EXISTS: 'seed 类型(type) 没找到',
    TARGET_NOT_EXISTS: '目标路径(targetPath) 不存在',
    COPY_COMMON_START: '开始 复制通用文件',
    COPY_COMMON_FINISHED: '复制通用文件 完成',
    COPY_COMMON_ERROR: '复制通用文件发生 错误',
    COPY_EXAMPLE_START: '开始 复制 seed 包文件',
    COPY_EXAMPLE_FINISHED: '复制 seed 包文件 完成',
    COPY_EXAMPLE_ERROR: '复制 seed 包文件发生 错误',
    CREATE_DIST_START: '开始 创建 dist 目录',
    CREATE_DIST_FINISHED: '创建 dist 目录 完成',
    COPY_ESLINT_START: '开始 复制 eslint, editorconfig',
    COPY_ESLINT_FINISHED: '复制 eslint, editorconfig 完成',
    COPY_ESLINT_ERROR: '复制 eslint, editorconfig 发生 错误'
  },
  OPTIMIZE: {
    ADD_VUE_DEPENDENCIES: '补充 构建所需的 vue, vuex, vue-router',
    WCONFIG_TYPE_NOT_EXISTS: 'webpack.config 初始化 失败, seed 不存在',
    WEBPACK_RUN_START: 'webpack 核心流程构建 开始',
    WEBPACK_DEV_SERVER_NEED_PRE_INSTALL: '需要在项目中安装前置依赖',
    WEBPACK_RUN_SUCCESS: 'webpack 核心流程构建 完成',
    LOADING_WEBPACK_START: '正在加载 webpack 模块',
    LOADING_WEBPACK_FINISHED: 'webpack 模块加载 完成',
    SEED_NOT_EXISTS: 'config.seed 不存在',
    SEED_NOT_SET: 'config.seed 没有配置',
    PARSE_WCONFIG_FAIL: '解析项目 webpack.config 出错',
    CHECK_SEED_PKG_START: 'seed 依赖检查 开始',
    CHECK_SEED_PKG_FINISHED: 'yyl seed 依赖检查 完成',
    CHECK_TARGET_PKG_START: '项目 依赖检查 开始',
    CHECK_TARGET_PKG_FINISHED: '项目 依赖检查 完成',
    USE_MIDDLEWARE: '使用 server 中间件',
    USE_DEV_SERVER: '使用 webpack-dev-server',
    DEV_SERVER_START_SUCCESS: 'webpack-dev-server 启动成功',
    DEV_SERVER_START_FAIL: 'webpack-dev-server 启动失败',
    DEV_SERVER_PORT_OCCUPIED: '端口 已被占用',
    USE_HMR: '使用 hmr 模式',
    WRITE_TO_DISK: '写入硬盘',
    MOMERY_ADDRESS: '缓存访问地址',
    USE_LIVERELOAD: '使用 livereload 模式'
  }
}

export const PLUGIN_NAME = 'yyl-seed'
