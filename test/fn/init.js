const extFs = require('yyl-fs');
const path = require('path');
const seed = require('../../index');
const util = require('yyl-util');
const fs = require('fs');
const tUtil = require('yyl-seed-test-util');
const COMMONS_PATH = util.path.join(seed.path, 'commons');

jest.setTimeout(200000);

// 完整性校验
const checkComplatable = (type, targetPath) => {
  const MAIN_PATH = util.path.join(seed.path, 'examples', type);

  const fromCommons = extFs.readFilesSync(COMMONS_PATH, (iPath) => {
    const relativePath = util.path.relative(COMMONS_PATH, iPath);
    return !relativePath.match(seed.init.FILTER.COPY_FILTER);
  });

  const fromMains = extFs.readFilesSync(MAIN_PATH, (iPath) => {
    const relativePath = util.path.relative(MAIN_PATH, iPath);
    return !relativePath.match(seed.init.FILTER.COPY_FILTER);
  });

  fromCommons.forEach((fromPath) => {
    const toPath = util.path.join(
      targetPath,
      util.path.relative(COMMONS_PATH, fromPath)
    );
    expect(fs.existsSync(toPath)).toEqual(true);
  });

  fromMains.forEach((fromPath) => {
    const toPath = util.path.join(
      targetPath,
      util.path.relative(MAIN_PATH, fromPath)
    );
    expect(fs.existsSync(toPath)).toEqual(true);
  });

  // other
  ['.gitignore', '.editorconfig'].forEach((fromPath) => {
    const toPath = util.path.join(targetPath, fromPath);
    expect(fs.existsSync(toPath)).toEqual(true);
  });
};

// 可以性校验
const checkUsage = (configPath) => {
  const config = tUtil.parseConfig(configPath);
  const dirname = path.dirname(configPath);
  const configKeys = Object.keys(config);
  const runner = (next) => {
    expect(configKeys.length).not.toEqual(0);
    seed.optimize(config, dirname).all({ silent: true }).on('finished', () => {
      const htmlFiles = extFs.readFilePaths(path.join(dirname, 'dist'), (iPath) => {
        return path.extname(iPath) === '.html';
      });
      expect(htmlFiles.length).not.toEqual(0);
      next();
    });
  };
  return new Promise(runner);
};

module.exports = {
  checkUsage,
  checkComplatable
};
