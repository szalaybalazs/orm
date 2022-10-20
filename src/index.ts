import * as chalk from 'chalk';
import { Command } from 'commander';
import { loadFile, parseConfig } from './core/config';
import { runMigration } from './migrations';
import { iOrmConfig } from './types/config';
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
    const options = await parseConfig(params);

    const id = name
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((w: string, i: number) => {
        if (i < 1) return w.toLowerCase();
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      })
      .join('');
    try {
      await runMigration(id, options.entities, options.snapshots, options.migrations, options.verbose);
    } catch (error) {
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
  .action(() => console.log('WIP'));

program
  .command('pull')
  .description('Pull schema from database and update snapshots')
  .action(() => console.log('WIP'));

program.parse();
