const { generatePreJS, executePreJS, executePreJSBuffer } = require('./src/toolchain');

const which = process.argv[2];
if (!which) {
  console.log('Generating Prejs Object (Done @ Build Time)');
  console.time('generate-prejs');
  generatePreJS('./spec/fixture/lodash.js', true);
  console.timeEnd('generate-prejs');

  const cp = require('child_process');
  cp.spawnSync(process.execPath, [__filename, 'raw'], {
    stdio: 'inherit',
  });

  cp.spawnSync(process.execPath, [__filename, 'prejs'], {
    stdio: 'inherit',
  });
} else if (which === 'raw') {
  console.log('\nLoading lodash.js and compiling for exports');
  console.time('lodash-js');
  require('./spec/fixture/lodash');
  console.timeEnd('lodash-js');
} else {
  console.log('\nLoading lodash.prejs and compiling for exports');
  console.time('lodash-prejs');
  executePreJS('./spec/fixture/lodash.prejs');
  console.timeEnd('lodash-prejs');
}
