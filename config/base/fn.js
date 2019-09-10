const path = require('path');
const fs = require('fs');

const cache = {
  map2Module: {}
};

const map2Module = function(str) {
  const nodeModulePath1 = path.join(__dirname, '../../');
  const nodeModulePath2 = path.join(__dirname, '../../../');
  if (cache.map2Module[str]) {
    return cache.map2Module[str];
  }

  const path1 = path.join(nodeModulePath1, 'node_modules', str);
  const path2 = path.join(nodeModulePath2, 'node_modules', str);

  if (fs.existsSync(path1)) {
    cache.map2Module[str] = path1;
  } else {
    cache.map2Module[str] = path2;
  }

  return cache.map2Module[str];
};

const map2SelfModule = function(str, dirname) {
  return path.join(dirname, 'node_module', str);
}

module.exports = {
  map2Module,
  map2SelfModule
};