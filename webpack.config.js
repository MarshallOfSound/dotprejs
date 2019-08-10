const PreJSPlugin = require('./PreJSPlugin');

module.exports = {
  entry: ['./example/lodash'],
  plugins: [
    new PreJSPlugin({
      assets: ['main.js'],
      runtime: require('electron'),
    }),
  ]
}
