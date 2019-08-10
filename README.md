# `.prejs`

> Pre-compile your JS bundles to improve boot performance in Node.JS or Electron

## How?

The `.prejs` uses the Node.JS `vm` API to create [V8 Compile Cache](https://v8.dev/blog/code-caching)
and use that cache when your file is loaded to dramatically improve the initial boot performance.

The benchmark in this repository `node benchmark.js` reports the following over 50% performance improvement.

```
Loading lodash.js and compiling for exports
lodash-js: 106.547ms

Loading lodash.prejs and compiling for exports
lodash-prejs: 43.084ms
```

## Installation

```bash
npm install dotprejs --save-dev

yarn add dotprejs --dev
```

## Usage

The `.prejs` module offers both a JS API and a drop-in webpack plugin.

### Webpack

```js
const PreJSPlugin = require('dotprejs/src/PreJSPlugin');

module.exports = {
  plugins: [
    new PreJSPlugin({
      // An array of asset names to convert to use prejs
      // This should be the filename that webpack would output
      assets: ['dist.js'],
      // OPTIONAL
      // Can be used to change the node.js runtime to use for
      // generating the V8 compile cache.  If you are targetting
      // electron this should be:
      // runtime: require('electron')
      runtime: process.execPath
    })
  ]
}
```

You don't have to change any of your other code, `.prejs` transparently creates a new file
continaing your code and compile and cache and injects the `.prejs` loader into the original
file.

### JS API

```js
const toolchain = require('dotprejs');

// Docs Coming Soon
```
