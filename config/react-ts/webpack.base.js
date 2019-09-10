const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { resolveModule } = require('../base/fn');


const init = (config) => {
  const wConfig = {
    output: {
      path: path.resolve(__dirname, config.alias.jsDest),
      filename: '[name].js',
      chunkFilename: `async_component/[name]${config.disableHash? '' : '-[chunkhash:8]'}.js`
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: [resolveModule('ts-loader')],
        exclude: /node_modules/
      }]
    },
    resolve: {
      modules: [
        path.join( __dirname, 'node_modules')
      ],
      alias: config.alias,
      extensions: ['.ts', '.js', '.json', '.wasm', '.mjs', '.tsx', '.jsx'],
      plugins: [new TsconfigPathsPlugin({
        configFile: path.join(config.alias.dirname, 'tsconfig.json')
      })]
    },
    resolveLoader: {
      modules: [
        path.join( __dirname, 'node_modules')
      ]
    },
    plugins: []
  };



  return wConfig;
};

module.exports = init;