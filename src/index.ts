import * as chalk from 'chalk';
import { Command } from 'commander';
import { parseConfig } from './core/config';
import { formatId } from './core/id';
import { debug } from './core/log';
import { getEmptyEntityContent } from './entities/template';
import { writeEntity } from './entities/write';
import { createEmptyMigration, runMigration } from './migrations';
import { revertMigrations } from './migrations/revert';
import { runMutations } from './migrations/run';

const program = new Command();

program.version('0.0.1', '-v, --version', 'Output the current version');

const addOptions = (command: Command): Command => {
  return command
    .option('-e, --entities <entities directory>', 'Directory containing all the entities')
    .option('-m, --migrations <migrations directory>', 'Directory containing all the migrations')
    .option('-s, --snapshots <snapshots directory>', 'Directory containing all the snapshots')
    .option('-c, --config <config file>', 'Path to the config file', '.')
    .option('--verbose');
};

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

addOptions(program.command('entity:create'))
  .description('Create empty entity')
  .argument('<name>', 'The name of the new entity')
  .action(async (input, params) => {
    try {
      debug(params.verbose, chalk.gray('Loading orm config...'));
      const name = formatId(input);
      const options = await parseConfig(params);
      const content = getEmptyEntityContent(name);
      debug(params.verbose, chalk.gray('Saving new entity...'));
      await writeEntity(name, options.entities, content);
    } catch (error) {
      // todo: handle config errors
      if (error.message === 'NO_CHANGES') console.log(chalk.reset('No changes found in schema...'));
      else console.log(error);
    }
  });

program
  .command('migration:run')
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

program
  .command('pull')
  .description('Pull schema from database and update snapshots')
  .action(() => console.log('WIP'));

program
  .command('show')
  .description('Show Orm ASCII Text')
  .action(async () => {
    const figlet = await import('figlet');

    const res = figlet.textSync('PostgresORM', {});
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log(
      chalk.cyan(
        res
          .split('\n')
          .map((l) => `      ${l}`)
          .join('\n'),
      ),
    );
    console.log(chalk.dim('       Advanced PostgreSQL focused ORM and Query Builder'));
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
  });

program.parse();
