#!/usr/bin/env node

const chalk = require('chalk');
const commandExistsSync = require('command-exists').sync;
const { exec } = require('child_process');
const path = require('path');

const arguments = process.argv.slice(2);

const run = async (cmd) => {
  const child = exec(cmd, { cwd: __dirname });
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(process.stdout);
  await new Promise((resolve) => child.on('close', resolve));
};

const tsInstalled = commandExistsSync('ts-node');

if (!tsInstalled) {
  console.log('');
  console.log(chalk.red('[ERROR]'), chalk.reset('Could not find ts-node command.'));
  console.log('');
  console.log(chalk.dim('Undiorm relies on both the ts-node and typscript packages'));
  console.log(
    chalk.dim('Run'),
    chalk.cyan('yarn global add ts-node typescript'),
    chalk.dim('or'),
    chalk.cyan('npm i -g ts-node typescript'),
    chalk.dim('to install them.'),
  );
} else run(`ts-node ${path.join(__dirname, 'src', 'index.ts')} ${arguments.join(' ')}`);
