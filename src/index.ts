import * as chalk from 'chalk';
import { Command } from 'commander';
import { parseConfig } from './core/config';
import { formatId } from './core/id';
import { debug } from './core/log';
import { runMigration } from './migrations';
import { runMutations } from './migrations/run';

const program = new Command();

program.version('0.0.1', '-v, --version', 'Output the current version');

program
  .command('generate')
  .argument('<name>', 'The name of the new migration')
  .option('-e, --entities <entities directory>', 'Directory containing all the entities')
  .option('-m, --migrations <migrations directory>', 'Directory containing all the migrations')
  .option('-s, --snapshots <snapshots directory>', 'Directory containing all the snapshots')
  .option('-c, --config <config file>', 'Path to the config file', '.')
  .option('--verbose')
  .action(async (name: string, params) => {
    try {
      debug(params.verbose, chalk.gray('Loading orm config...'));
      const options = await parseConfig(params);
      await runMigration(formatId(name), options.entities, options.snapshots, options.migrations, options.verbose);
    } catch (error) {
      // todo: handle config errors
      if (error.message === 'NO_CHANGES') console.log(chalk.reset('No changes found in schema...'));
      else console.log(error);
    }
  });

program
  .command('create')
  .description('Create empty migration')
  .action(() => console.log('WIP'));

program
  .command('run')
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

program
  .command('pull')
  .description('Pull schema from database and update snapshots')
  .action(() => console.log('WIP'));

program.parse();
