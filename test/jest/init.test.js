// WARNING 需要 连公司 vpn 再进行测试
const path = require('path');
const util = require('yyl-util');
const extFs = require('yyl-fs');
const fs = require('fs');
const seed = require('../../index');
const tUtil = require('yyl-seed-test-util');

jest.setTimeout(30000);

// + vars
const FRAG_PATH = path.join(__dirname, '../../../__frag/init');
const COMMONS_PATH = util.path.join(seed.path, 'commons');
// - vars

tUtil.frag.init(FRAG_PATH);

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


seed.examples.forEach((type) => {
  test(`seed.init ${type}`, async () => {
    await tUtil.frag.build();
    const targetPath = path.join(FRAG_PATH, type);
    extFs.mkdirSync(targetPath);

    const timePadding = {
      start: 0,
      msg: 0,
      finished: 0
    };
    await util.makeAwait((next) => {
      seed.init(type, targetPath)
        .on('start', () => {
          timePadding.start++;
        })
        .on('msg', () => {
          timePadding.msg++;
        })
        .on('finished', () => {
          timePadding.finished++;

          // times check
          expect(timePadding.start).toEqual(1);
          expect(timePadding.msg).not.toEqual(0);
          expect(timePadding.finished).toEqual(1);

          checkComplatable(type, targetPath);
          const configPath = path.join(targetPath, 'config.js');

          checkUsage(configPath).then(() => {
            next();
          });
        });
    });

    await tUtil.frag.destroy();
  });
});



