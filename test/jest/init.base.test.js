// WARNING 需要 连公司 vpn 再进行测试
const path = require('path');
const util = require('yyl-util');
const extFs = require('yyl-fs');
const seed = require('../../index');
const tUtil = require('yyl-seed-test-util');

const { checkComplatable,  checkUsage } = require('../fn/init');

// + vars
const type = 'base';
const FRAG_PATH = path.join(__dirname, `../../../__frag/init-${type}`);
// - vars

tUtil.frag.init(FRAG_PATH);

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



