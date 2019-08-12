const PreJSPlugin = require('./src/PreJSPlugin');

module.exports = {
  entry: ['./spec/fixture/lodash'],
  plugins: [
    new PreJSPlugin({
      assets: ['main.js'],
      runtime: require('electron'),
    }),
  ]
}
