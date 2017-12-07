const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.conf.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const utils = require('./utils')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = merge(baseConfig, {
  // Point entry to the application's server entry file
  entry: './src/entry-server.js',
  // This allows webpack to handle dynamic imports in Node-appropriate fashion,
  // And when compiling Vue components,
  // Tell `vue-loader` to send server-oriented code.
  target: 'node',
  // Provide source map support for bundle renderer
  devtool: '#source-map',
  // Here to tell the server bundle Node-style exports (Node-style exports)
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // Externalized applications rely on modules. Can make the server build faster,
  // And generate smaller bundle files.
  externals: nodeExternals({
    // Do not externalize the dependencies that webpack needs to handle.
    // You can add more file types here. For example, raw * .vue files are not processed,
    // You should also whitelist dependencies that modify `global` (such as polyfill)
    whitelist: /\.css$/
  }),
  // This is the entire output of the server
  // Build as a single JSON file plug-in.
  // The default file name is `vue-ssr-server-bundle.json`
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[hash:8].css')
    }),
    new VueSSRServerPlugin()
  ]
})
