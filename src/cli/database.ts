import * as chalk from 'chalk';
import { Command } from 'commander';
import { readdirSync } from 'fs-extra';
import { prompt } from 'inquirer';
import { join } from 'path';
import { parseConfig, saveConfig } from '../core/config';
import { broadcast } from '../core/log';
import { pullSchema } from '../database/pull';
import { saveEntities } from '../entities/save';
import { initQuestions } from '../misc/initQuestions';
import { saveSnapshot } from '../snapshots';
import { iOrmConfig, tEntity } from '../types';
import { addOptions } from './options';

export const createDatabaseProgram = (program: Command) => {
  program
    .command('init')
    .summary('Initialise a new, empty configuration')
    .action(async () => {
      const folderContent = readdirSync(process.cwd());
      const alreadyExists = folderContent.some((file) => /.orm|ormconfig/.test(file));
      if (alreadyExists) {
        broadcast('');
        const answers = await prompt([
          {
            type: 'confirm',
            name: 'reinitialise',
            message: 'Existing orm configuration found, are you sure you want to reinitialize?',
            default: false,
          },
        ]);
        if (!answers.reinitialise) {
          broadcast(chalk.dim('Quitting...'));
          broadcast('');
          return;
        }
      }
      const { template, use_template, generate_types, connection, ...answers } = await prompt(initQuestions);

      broadcast('');
      broadcast(chalk.reset('Initialising project with template:'), chalk.bold(`'${template || 'default'}'`));

      const config: iOrmConfig = {
        driver: 'postgres',
        ...answers,
      };

      await saveConfig(config);

      broadcast('');
      broadcast(chalk.reset('Saved orm config at'), chalk.green(join(process.cwd(), '.ormconfig.ts')));
      broadcast('');
      broadcast(chalk.bold('Successfully initialised orm project. 🎉'));
      broadcast('');
      broadcast(chalk.dim('Next steps:'));
      broadcast(
        chalk.reset('1) Create your first entity by running:'),
        chalk.cyan('entity:create <name of the entity>'),
      );
      broadcast(chalk.reset('2) Generate the first migration:'), chalk.cyan('migrations:generate <migration>'));
      broadcast(chalk.reset('3) Execute your new migration:'), chalk.cyan('migrations:run'));

      broadcast('');
      broadcast(chalk.reset('Or pull the current schema of the database by running:'), chalk.cyan('database:pull'));
      broadcast('');
    });
};
export const createDatabasePullProgram = (program: Command) => {
  addOptions(program.command('database:pull').summary('Pull database schema from connection'))
    .option('-d, --dryrun', 'Dry run')
    .action(async (params) => {
      broadcast(chalk.reset('Pulling database schema from connection...'));
      const options = await parseConfig(params);

      const entities = await pullSchema(options);

      if (options.dryrun) broadcast(JSON.stringify(entities, null, 2));
      else {
        await saveEntities(entities, options.entitiesDirectory);
        await saveSnapshot(options.snapshotsDirectory, 'init', generateSnapshots(entities));
      }

      broadcast('');
      broadcast(chalk.bold('Successfully pulled database schema. 🎉'));
    });
};

const generateSnapshots = (entities: { [key: string]: tEntity }) => {
  return Object.values(entities).reduce((acc, entity) => ({ ...acc, [entity.name]: entity }), {});
};
