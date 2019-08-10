const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const generateCache = (code, runInNewContext) => {
  const script = new vm.Script(code);
  if (runInNewContext) {
    const context = vm.createContext();
    script.runInNewContext(context);
  }
  return script.createCachedData();
}

const generatePreJS = (filepath, runInNewContext = false) => {
  assert(filepath.endsWith('.js'));
  const target = `${filepath.replace(/\.js$/, '.prejs')}`
  assert(fs.existsSync(filepath))
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
  }
  const code = fs.readFileSync(filepath);
  const prejs = generatePreJSBuffer(code, runInNewContext);
  fs.writeFileSync(target, prejs);
}

const generatePreJSBuffer = (code, runInNewContext = false) => {
  // Ensure the code length will not exceed a 32 bit int
  assert(code.length < Math.pow(2, 31));
  const buffer = generateCache(code, runInNewContext);
  const header = Buffer.alloc(4);
  header.writeUInt32LE(code.length);
  return Buffer.concat([
    header,
    code,
    buffer
  ])
}

const executePreJS = (filename) => {
  const content = fs.readFileSync(filename);
  const codeLength = content.readUInt32LE(0);
  const code = content.slice(4, 4 + codeLength);
  const cache = content.slice(4 + codeLength);
  const script = new vm.Script(code, {
    cachedData: cache,
  });
  return script.runInThisContext();
}

module.exports = {
  generatePreJSBuffer,
  generatePreJS,
  executePreJS
}
