const path = require('path');

const init = () => {
  const wConfig = {
    resolve: {
      modules: [
        path.join( __dirname, 'node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        path.join(__dirname, 'node_modules')
      ]
    },
    plugins: []
  };

  return wConfig;
};

module.exports = init;