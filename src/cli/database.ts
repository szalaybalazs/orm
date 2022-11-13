import * as chalk from 'chalk';
import { Command } from 'commander';
import { readdirSync } from 'fs-extra';
import { prompt } from 'inquirer';
import { join } from 'path';
import { saveConfig } from '../core/config';
import { initQuestions } from '../misc/initQuestions';
import { iOrmConfig } from '../types';

export const createDatabaseProgram = (program: Command) => {
  program
    .command('init')
    .summary('Initialise a new, empty configuration')
    .action(async () => {
      const folderContent = readdirSync(process.cwd());
      const alreadyExists = folderContent.some((file) => /.orm|ormconfig/.test(file));
      if (alreadyExists) {
        console.log('');
        const answers = await prompt([
          {
            type: 'confirm',
            name: 'reinitialise',
            message: 'Existing orm configuration found, are you sure you want to reinitialize?',
            default: false,
          },
        ]);
        if (!answers.reinitialise) {
          console.log(chalk.gray('Quitting...'));
          console.log('');
          return;
        }
      }
      const { template, use_template, generate_types, connection, ...answers } = await prompt(initQuestions);

      console.log('');
      console.log(chalk.reset('Initialising project with template:'), chalk.bold(`'${template || 'default'}'`));

      const config: iOrmConfig = {
        driver: 'postgres',
        ...answers,
      };

      await saveConfig(config);

      console.log('');
      console.log(chalk.reset('Saved orm config at'), chalk.green(join(process.cwd(), '.ormconfig.ts')));
      console.log('');
      console.log(chalk.bold('Successfully initialised orm project. 🎉'));
      console.log('');
      console.log(chalk.gray('Next steps:'));
      console.log(
        chalk.reset('1) Create your first entity by running:'),
        chalk.cyan('entity:create <name of the entity>'),
      );
      console.log(chalk.reset('2) Generate the first migration:'), chalk.cyan('migrations:generate <migration>'));
      console.log(chalk.reset('3) Execute your new migration:'), chalk.cyan('migrations:run'));

      console.log('');
      console.log(chalk.reset('Or pull the current schema of the database by running:'), chalk.cyan('database:pull'));
      console.log('');
    });
};
