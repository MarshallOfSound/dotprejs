const assert = require('assert');
const cp = require('child_process');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const { RawSource } = require('webpack-sources');

const toolchain = require('./toolchain');

const tmpPrefix = path.resolve(os.tmpdir(), 'prejs-');

const GLOBALS_TO_CAPTURE = ['exports', 'require', 'module', '__filename', '__dirname', 'Buffer']

class PreJSPlugin {
  constructor(options = {}) {
    this.options = options;
    assert(this.options.assets);
    assert(Array.isArray(this.options.assets));
    this.runtime = this.options.runtime || process.execPath;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'PreJSPlugin',
      async (compilation, callback) => {
        try {
          for (const filename of Object.keys(compilation.assets)) {
            if (!this.options.assets.includes(filename)) continue;
            const tmpDir = await fs.mkdtemp(tmpPrefix);
            const source = path.resolve(tmpDir, 'in.js');
            const out = path.resolve(tmpDir, 'out');
            const wrapped = `(function (${GLOBALS_TO_CAPTURE.join(', ')}) {\n${Buffer.from(compilation.assets[filename].source())}\n})`;
            await fs.writeFile(source, wrapped);
            const result = cp.spawnSync(this.runtime, [path.resolve(__dirname, 'runtime-cache-creator.js'), source, out]);
            if (result.status !== 0) throw new Error('Failed to generate cache');
            const prejs = await fs.readFile(out);
            await fs.remove(tmpDir);

            assert(filename.endsWith('.js'));
            const target = `${filename.replace(/\.js$/, '.prejs')}`
            compilation.assets[target] = new RawSource(prejs);
            compilation.assets[filename] = new RawSource(
              `const fs=require('fs');const vm=require('vm');(${toolchain.executePreJS.toString()})(require('path').resolve(__dirname, '${target}'))(${GLOBALS_TO_CAPTURE.join(', ')})`
            )
          }
        } catch (err) {
          return callback(err);
        }

        callback();
      }
    );
  }
}

module.exports = PreJSPlugin;
