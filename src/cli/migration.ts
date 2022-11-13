import * as chalk from 'chalk';
import { Command } from 'commander';
import { parseConfig } from '../core/config';
import { formatId } from '../core/id';
import { debug, formatObject } from '../core/log';
import { createEmptyMigration } from '../migrations';
import { generateMigration } from '../migrations/generate';
import { revertMigrations } from '../migrations/revert';
import { runMutations } from '../migrations/run';
import { addOptions } from './options';

export const createMigrationProgram = (program: Command) => {
  addOptions(program.command('migration:generate'))
    .argument('<name>', 'The name of the new migration')
    .option('-d, --dryrun', 'Dry run')
    .action(async (name: string, params) => {
      try {
        const options = await parseConfig(params);
        debug(params.verbose, chalk.reset('Options loaded: '));
        debug(params.verbose, chalk.gray(formatObject(options)));
        await generateMigration(formatId(name), name, options);
      } catch (error) {
        // todo: handle config errors
        if (error.message === 'NO_CHANGES') console.log(chalk.reset('No changes found in schema...'));
        else console.log(error);
      }
    });

  addOptions(program.command('migration:create'))
    .description('Create empty migration')
    .argument('<name>', 'The name of the new migration')
    .action(async (name, params) => {
      try {
        const options = await parseConfig(params);
        debug(params.verbose, chalk.reset('Options loaded: '));
        debug(params.verbose, chalk.gray(formatObject(options)));
        await createEmptyMigration(formatId(name), name, options);
      } catch (error) {
        // todo: handle config errors
        if (error.message === 'NO_CHANGES') console.log(chalk.reset('No changes found in schema...'));
        else console.log(error);
      }
    });

  addOptions(program.command('migration:run'))
    .description('Run all available migrations')
    .option('--verbose')
    .action(async (params) => {
      const options = await parseConfig(params);
      debug(params.verbose, chalk.reset('Options loaded: '));
      debug(params.verbose, chalk.gray(formatObject(options)));
      try {
        await runMutations(options);
      } catch (error) {
        console.log(error);
      }
    });

  addOptions(program.command('migration:revert'))
    .description('Revert database to a specific migration')
    .option('-m, --migration <migration  id>', 'ID of the migration the database will be reverted to.')
    .action(async (params) => {
      const options = await parseConfig(params);
      debug(params.verbose, chalk.reset('Options loaded: '));
      debug(params.verbose, chalk.gray(formatObject(options)));

      try {
        await revertMigrations(options);
      } catch (error) {
        console.log(error);
      }
    });
};
