const path = require('path')
const fs = require('fs')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const init = (config) => {
  const localPkgPath = path.join(config.alias.dirname, 'package.json')
  const localTsLoaderPath = path.join(config.alias.dirname, 'node_modules', 'ts-loader')
  const localTsLoaderExists = fs.existsSync(localTsLoaderPath)
  let useProjectTs = false
  if (fs.existsSync(localPkgPath)) {
    const localPkg = require(localPkgPath)
    if (
      localPkg.dependencies &&
      localPkg.dependencies['ts-loader'] &&
      localPkg.dependencies['typescript'] &&
      localTsLoaderExists
    ) {
      useProjectTs = true
    }
  }

  const wConfig = {
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: [useProjectTs ? require.resolve(localTsLoaderPath) : 'ts-loader'],
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
  }



  return wConfig
}

module.exports = init