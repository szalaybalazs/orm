import * as chalk from 'chalk';
import { Command } from 'commander';
import { parseConfig } from '../core/config';
import { formatId } from '../core/id';
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
        console.log(chalk.reset('Generating migration from changes...'));
        const options = await parseConfig(params);
        const migration = await generateMigration(formatId(name), name, options);

        console.log(chalk.bold('Migration generated 🎉'));

        // Migration only gets returned for dry runs
        if (migration) {
          console.log('');
          console.log(migration);
        } else {
          console.log(
            chalk.reset('Run'),
            chalk.cyan('migration:run'),
            chalk.reset('to apply all the changes to the database'),
          );
        }
      } catch (error) {
        // todo: handle config errors
        if (error.message === 'NO_CHANGES') {
          console.log(chalk.cyan('No changes found in schema, skipping...'));
        } else console.log(error);
      }
    });

  addOptions(program.command('migration:create'))
    .description('Create empty migration')
    .argument('<name>', 'The name of the new migration')
    .action(async (name, params) => {
      try {
        const options = await parseConfig(params);
        const path = await createEmptyMigration(formatId(name), name, options);

        console.log(chalk.bold('Migration created 🥳'));
        console.log(chalk.reset('Saved at'), chalk.cyan(path));
      } catch (error) {
        if (error.message === 'EXISTS') {
          console.log(chalk.red('[ERROR]'), chalk.reset('A migration already exists with the same name.'));
        } else console.log(chalk.red('[ERROR]'), chalk.reset(error));
      }
    });

  addOptions(program.command('migration:run'))
    .description('Run all available migrations')
    .option('--verbose')
    .action(async (params) => {
      try {
        const options = await parseConfig(params);
        await runMutations(options);
        console.log(chalk.bold('All new migrations have been successfully applied 🎉'));
      } catch (error) {
        if (error.message === 'NO_NEW_MIGRATIONS') {
          console.log(chalk.reset('No new migration found, skipping...'));
        } else console.log(chalk.red('[ERROR]'), chalk.reset(error));
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
        console.log(error);
      }
    });
};
