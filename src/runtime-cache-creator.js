const fs = require('fs');

const toolchain = require('./toolchain');

const input = process.argv[2];
const output = process.argv[3];

const buffer = toolchain.generatePreJSBuffer(fs.readFileSync(input), false)
fs.writeFileSync(output, buffer);

process.exit(0);
