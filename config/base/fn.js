const path = require('path');
const fs = require('fs');
const util = require('util');

const map2Module = function(str) {
  const nodeModulePath1 = path.join(__dirname, '../../');
  const nodeModulePath2 = path.join(__dirname, '../../../');
  const path1 = path.join(nodeModulePath1, 'node_modules', str);
  if (fs.existsSync(path1)) {
    return path1;
  } else {
    return util.path.join(nodeModulePath2, str);
  }
};

module.exports = {
  map2Module
};