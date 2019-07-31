// WARNING 需要 连公司 vpn 再进行测试
const seed = require('../../index');

test('seed.examples', async () => {
  expect(seed.examples.length).not.toEqual(0);
  seed.examples.forEach((type) => {
    expect(/^\./.test(type)).not.toEqual(true);
  });
});