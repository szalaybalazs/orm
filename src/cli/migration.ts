import * as chalk from 'chalk';
import { Command } from 'commander';
import { parseConfig } from '../core/config';
import { formatId } from '../core/id';
import { broadcast } from '../core/log';
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
        broadcast(chalk.reset('Generating migration from changes...'));
        const options = await parseConfig(params);
        const migration = await generateMigration(formatId(name), name, options);

        broadcast(chalk.bold('Migration generated 🎉'));

        // Migration only gets returned for dry runs
        if (migration) {
          broadcast('');
          broadcast(migration);
        } else {
          broadcast(
            chalk.reset('Run'),
            chalk.cyan('migration:run'),
            chalk.reset('to apply all the changes to the database'),
          );
        }
      } catch (error) {
        // todo: handle config errors
        if (error.message === 'NO_CHANGES') {
          broadcast(chalk.cyan('No changes found in schema, skipping...'));
        } else broadcast(error);
      }
    });

  addOptions(program.command('migration:create'))
    .description('Create empty migration')
    .argument('<name>', 'The name of the new migration')
    .action(async (name, params) => {
      try {
        const options = await parseConfig(params);
        const path = await createEmptyMigration(formatId(name), name, options);

        broadcast(chalk.bold('Migration created 🥳'));
        broadcast(chalk.reset('Saved at'), chalk.cyan(path));
      } catch (error) {
        if (error.message === 'EXISTS') {
          broadcast(chalk.red('[ERROR]'), chalk.reset('A migration already exists with the same name.'));
        } else broadcast(chalk.red('[ERROR]'), chalk.reset(error));
      }
    });

  addOptions(program.command('migration:run'))
    .description('Run all available migrations')
    .option('--verbose')
    .action(async (params) => {
      try {
        const options = await parseConfig(params);
        await runMutations(options);
        broadcast(chalk.bold('All new migrations have been successfully applied 🎉'));
      } catch (error) {
        if (error.message === 'NO_NEW_MIGRATIONS') {
          broadcast(chalk.reset('No new migration found, skipping...'));
        } else broadcast(chalk.red('[ERROR]'), chalk.reset(error));
      }
    });

  addOptions(program.command('migration:revert'))
    .description('Revert database to a specific migration')
    .option('-m, --migration <migration  id>', 'ID of the migration the database will be reverted to.')
    .action(async (params) => {
      // todo: add verbose logging & cleanup
      const options = await parseConfig(params);

      try {
        await revertMigrations(options);
      } catch (error) {
        broadcast(error);
      }
    });
};
