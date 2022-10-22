import * as chalk from 'chalk';
import { Command } from 'commander';
import { parseConfig } from '../core/config';
import { formatId } from '../core/id';
import { debug } from '../core/log';
import { createEmptyMigration, runMigration } from '../migrations';
import { revertMigrations } from '../migrations/revert';
import { runMutations } from '../migrations/run';
import { addOptions } from './options';

export const createMigraationProgram = (program: Command) => {
  addOptions(program.command('migration:generate'))
    .argument('<name>', 'The name of the new migration')

    .action(async (name: string, params) => {
      try {
        debug(params.verbose, chalk.gray('Loading orm config...'));
        const options = await parseConfig(params);
        await runMigration(formatId(name), name, options);
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
        debug(params.verbose, chalk.gray('Loading orm config...'));
        const options = await parseConfig(params);
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
      debug(params.verbose, chalk.gray('Loading orm config...'));
      const options = await parseConfig(params);
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
      debug(params.verbose, chalk.gray('Loading orm config...'));
      const options = await parseConfig(params);

      try {
        await revertMigrations(options);
      } catch (error) {
        console.log(error);
      }
    });
};
