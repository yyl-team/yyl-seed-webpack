/*!
 * yyl-seed-webpack cjs 3.0.0
 * (c) 2020 - 2021 
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');
var extOs = require('yyl-os');
var SeedResponse = require('yyl-seed-response');
var webpack = require('webpack');
var merge = require('webpack-merge');
var yylBaseWebpackConfig = require('yyl-base-webpack-config');
var initVue2WebpackConfig = require('yyl-vue2-webpack-config');
var WebpackDevServer = require('webpack-dev-server');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var extOs__default = /*#__PURE__*/_interopDefaultLegacy(extOs);
var SeedResponse__default = /*#__PURE__*/_interopDefaultLegacy(SeedResponse);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);
var initVue2WebpackConfig__default = /*#__PURE__*/_interopDefaultLegacy(initVue2WebpackConfig);
var WebpackDevServer__default = /*#__PURE__*/_interopDefaultLegacy(WebpackDevServer);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// TODO: ProgressPlugin
function commonConfig(option) {
    return {
        resolve: {
            modules: ['node_modules'],
            fallback: {
                'url': require.resolve('url/'),
                'punycode': require.resolve('punycode/'),
                'querystring': require.resolve('querystring-es3'),
                'webpack/hot': path__default['default'].join(require.resolve('webpack/hot/emitter.js'), '..'),
                'webpack/hot/emitter': require.resolve('webpack/hot/emitter.js'),
                'ansi-html': require.resolve('ansi-html'),
                'html-entities': require.resolve('html-entities'),
                'events': require.resolve('events/'),
                'strip-ansi': require.resolve('strip-ansi'),
                'loglevel': require.resolve('loglevel'),
                'sockjs-client/dist/sockjs': require.resolve('sockjs-client/dist/sockjs'),
                'base64-js': require.resolve('base64-js'),
                'ansi-regex': require.resolve('ansi-regex'),
                'isarray': require.resolve('isarray')
            }
        }
    };
}

// TODO: ProgressPlugin
function wConfig(option) {
    var _a;
    const { env, yylConfig } = option;
    return merge.merge(yylBaseWebpackConfig.initYylBaseConfig({
        context: ((_a = yylConfig === null || yylConfig === void 0 ? void 0 : yylConfig.alias) === null || _a === void 0 ? void 0 : _a.dirname) || process.cwd(),
        env,
        alias: yylConfig.alias,
        yylConfig
    }), commonConfig());
}

function wConfig$1(option) {
    var _a;
    const { env, yylConfig } = option;
    return merge.merge(initVue2WebpackConfig__default['default']({
        context: ((_a = yylConfig === null || yylConfig === void 0 ? void 0 : yylConfig.alias) === null || _a === void 0 ? void 0 : _a.dirname) || process.cwd(),
        env,
        alias: yylConfig.alias,
        yylConfig
    }), commonConfig());
}

const LANG = {
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
};
const PLUGIN_NAME = 'yyl-seed';

function toCtx(ctx) {
    return ctx;
}
function envInit(option) {
    var _a, _b, _c, _d;
    const { yylConfig, env } = option;
    const rEnv = Object.assign({}, env);
    if (rEnv.ver === 'remote') {
        rEnv.remote = true;
    }
    if (rEnv.remote) {
        rEnv.ver = 'remote';
    }
    rEnv.staticRemotePath =
        rEnv.remote || rEnv.isCommit || rEnv.proxy
            ? ((_a = yylConfig === null || yylConfig === void 0 ? void 0 : yylConfig.commit) === null || _a === void 0 ? void 0 : _a.staticHost) || ((_b = yylConfig === null || yylConfig === void 0 ? void 0 : yylConfig.commit) === null || _b === void 0 ? void 0 : _b.hostname)
            : '/';
    rEnv.mainRemotePath =
        rEnv.remote || rEnv.isCommit || rEnv.proxy
            ? ((_c = yylConfig === null || yylConfig === void 0 ? void 0 : yylConfig.commit) === null || _c === void 0 ? void 0 : _c.mainHost) || ((_d = yylConfig === null || yylConfig === void 0 ? void 0 : yylConfig.commit) === null || _d === void 0 ? void 0 : _d.hostname)
            : '/';
    return rEnv;
}
function buildWConfig(option) {
    const { env, ctx, yylConfig, root } = option;
    const pjWConfigPath = path__default['default'].join(root, 'webpack.config.js');
    let wConfig$2;
    switch (yylConfig.seed) {
        case 'vue2':
        case 'vue2-ts':
            wConfig$2 = wConfig$1({ env, yylConfig });
            break;
        case 'base':
        case 'react-ts':
        default:
            wConfig$2 = wConfig({ env, yylConfig });
            break;
    }
    if (fs__default['default'].existsSync(pjWConfigPath)) {
        let pjWConfig = require(pjWConfigPath);
        if (typeof pjWConfig === 'function') {
            try {
                pjWConfig = pjWConfig(env, { yylConfig, env });
            }
            catch (er) {
                try {
                    // 兼容 yyl 3.0 webpack.config 写法
                    pjWConfig = pjWConfig({ yylConfig, env });
                }
                catch (er) {
                    throw new Error(`${LANG.OPTIMIZE.PARSE_WCONFIG_FAIL}: ${er.message}`);
                }
            }
        }
        return merge__default['default'](pjWConfig, wConfig$2);
    }
    else {
        return wConfig$2;
    }
}
function initCompilerLog(op) {
    const { compiler, env, response } = op;
    compiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
        response.trigger('progress', ['start']);
    });
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
        const statsInfo = stats.toJson({
            all: false,
            assets: true,
            errors: true,
            warnings: true,
            logging: 'warn'
        });
        if (statsInfo.warnings) {
            statsInfo.warnings.forEach((er) => {
                response.trigger('msg', ['warn', [er.moduleName || '', er.message]]);
            });
        }
        if (statsInfo.errors) {
            statsInfo.errors.forEach((er) => {
                response.trigger('msg', ['error', [er.moduleName || '', er.message]]);
            });
        }
        // 显示完整构建过程
        const logStr = stats.toString({
            chunks: false,
            color: true
        });
        response.trigger('msg', [
            'info',
            logStr.split(/[\r\n]+/).map((str) => str.trim().replace(/\s+/g, ' '))
        ]);
        response.trigger('progress', ['finished']);
    });
    compiler.hooks.failed.tap(PLUGIN_NAME, (err) => {
        response.trigger('msg', ['error', [LANG.OPTIMIZE.DEV_SERVER_START_FAIL, err]]);
        response.trigger('progress', ['finished']);
    });
}

/** 构建函数 */
const optimize = (option) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { yylConfig, root, env, ctx } = option;
    // response 初始化
    const iRes = new SeedResponse__default['default']();
    // + 运行前校验
    // npm 包自动安装
    const pkgPath = path__default['default'].join(root, 'package.json');
    if (fs__default['default'].existsSync(pkgPath)) {
        iRes.trigger('msg', ['info', [LANG.OPTIMIZE.CHECK_SEED_PKG_START]]);
        yield extOs__default['default'].installPackage(pkgPath, {
            production: false,
            loglevel: env.silent ? 'silent' : 'info',
            useYarn: !!yylConfig.yarn
        });
        iRes.trigger('msg', ['info', [LANG.OPTIMIZE.CHECK_SEED_PKG_FINISHED]]);
    }
    // 老版本兼容
    if (toCtx(yylConfig.workflow) === 'webpack-vue2') {
        yylConfig.workflow = 'webpack';
        yylConfig.seed = 'vue2';
    }
    // - 运行前校验
    const wConfig = buildWConfig({
        yylConfig,
        env,
        root,
        ctx
    });
    const compiler = webpack.webpack(merge.merge(wConfig, {
        stats: 'none',
        infrastructureLogging: {
            level: 'none'
        },
        plugins: [
            new webpack.ProgressPlugin({
                activeModules: true,
                handler(percentage, ...args) {
                    iRes.trigger('progress', [percentage, 'info', args]);
                }
            })
        ]
    }));
    /** 使用项目自带server */
    const usePjServer = !!((_a = yylConfig.localserver) === null || _a === void 0 ? void 0 : _a.entry);
    // env 初始化
    env = envInit({ env, yylConfig });
    const opzer = {
        root: root,
        response: iRes,
        handles: ['watch', 'all'],
        ignoreServer: true,
        getConfigSync() {
            return yylConfig;
        },
        appWillMount(app) {
            return __awaiter(this, void 0, void 0, function* () {
                yylBaseWebpackConfig.initMiddleWare({
                    app,
                    env,
                    compiler,
                    yylConfig,
                    logger(type, subType, args) {
                        iRes.trigger(type, [subType, args]);
                    }
                });
            });
        },
        on(eventName, fn) {
            iRes.on(eventName, fn);
            return opzer;
        },
        all() {
            iRes.trigger('progress', ['start', 'info', [LANG.OPTIMIZE.WEBPACK_RUN_START]]);
            initCompilerLog({
                compiler,
                response: iRes,
                env
            });
            compiler.run(() => undefined);
            return opzer;
        },
        watch() {
            var _a;
            iRes.trigger('progress', ['start']);
            iRes.trigger('msg', ['info', [LANG.OPTIMIZE.WEBPACK_RUN_START]]);
            if (usePjServer) {
                compiler.watch({
                    aggregateTimeout: 2000
                }, () => { });
                initCompilerLog({
                    compiler,
                    response: iRes,
                    env
                });
            }
            else {
                iRes.trigger('msg', ['info', [LANG.OPTIMIZE.USE_DEV_SERVER]]);
                const serverPort = env.port || ((_a = yylConfig === null || yylConfig === void 0 ? void 0 : yylConfig.localserver) === null || _a === void 0 ? void 0 : _a.port) || 5000;
                extOs__default['default'].checkPort(serverPort).then((canUse) => {
                    if (!canUse) {
                        iRes.trigger('msg', [
                            'error',
                            [`${LANG.OPTIMIZE.DEV_SERVER_PORT_OCCUPIED}: ${serverPort}`]
                        ]);
                        iRes.trigger('progress', ['finished']);
                        return;
                    }
                    try {
                        const devServer = new WebpackDevServer__default['default'](compiler, Object.assign({}, wConfig.devServer));
                        devServer.listen(serverPort, (err) => {
                            if (err) {
                                iRes.trigger('msg', ['error', [LANG.OPTIMIZE.DEV_SERVER_START_FAIL, err]]);
                            }
                            else {
                                iRes.trigger('msg', ['success', [LANG.OPTIMIZE.DEV_SERVER_START_SUCCESS]]);
                            }
                        });
                        initCompilerLog({
                            compiler,
                            response: iRes,
                            env
                        });
                    }
                    catch (err) {
                        iRes.trigger('msg', ['error', [LANG.OPTIMIZE.DEV_SERVER_START_FAIL, err]]);
                        iRes.trigger('progress', ['finished']);
                    }
                });
            }
            return opzer;
        }
    };
    return opzer;
});

const pkg = require('../package.json');
const entry = {
    name: 'webpack',
    version: pkg.version,
    path: __dirname,
    optimize,
    initPackage: {
        default: ['init-me-seed-yyl-webpack'],
        yy: ['@yy/init-me-seed-yyl-react', '@yy/init-me-seed-yyl-vue']
    }
};
module.exports = entry;

exports.default = entry;
