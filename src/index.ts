import * as chalk from 'chalk';
import { Command } from 'commander';
import { runMigration } from './migrations';
const program = new Command();

program.version('0.0.1', '-v, --version', 'Output the current version');

program
  .command('generate')
  .argument('<name>', 'The name of the new migration')
  .option('-e, --entities <entities directory>', 'Directory containing all the entities', './entities')
  .option('-m, --migrations <migrations directory>', 'Directory containing all the migrations', './migrations')
  .option('-s, --snapshots <snapshots directory>', 'Directory containing all the snapshots', './snapshots')
  .option('-c, --config <config file>', 'Path to the config file', './config.js')
  .option('--verbose')
  .action(async (name: string, options) => {
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

program.parse();
