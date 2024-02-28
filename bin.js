#!/usr/bin/env node

const chalk = require('chalk');
const commandExistsSync = require('command-exists').sync;
const path = require('path');
const spawn = require('cross-spawn');

const arguments = process.argv.slice(2);

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
} else spawn('ts-node', [path.join(__dirname, 'src', 'index.ts'), ...arguments], { stdio: 'inherit' });
