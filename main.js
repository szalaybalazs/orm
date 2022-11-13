const { exec } = require('child_process');
const path = require('path');

const arguments = process.argv.slice(2);

const run = async (cmd) => {
  const child = exec(cmd);
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(process.stdout);
  await new Promise((resolve) => child.on('close', resolve));
};

run(`npm run ts ${path.join(__dirname, 'src/index.ts')} ${arguments.join(' ')}`);
