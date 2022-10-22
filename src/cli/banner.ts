import * as chalk from 'chalk';
import { Command } from 'commander';
import { prefix } from '../core/prefix';

/**
 * Create PostgresORM banner command
 * @param program commander program
 */
export const createBannerProgram = (program: Command) => {
  program
    .command('show')
    .summary('Show banner')
    .description('Show PostgresORM ASCII Banner')
    .action(async () => {
      const figlet = await import('figlet');

      const res = figlet.textSync('PostgresORM', {});
      const banner = prefix(res, 8);

      const log = [
        prefix('', 15, '\n'),
        chalk.cyan(banner),
        chalk.dim(prefix(prefix('Advanced PostgreSQL focused ORM and Query Builder', 9), 1, '\n')),
        prefix('', 15, '\n'),
      ];

      log.map((log) => console.log(log));
    });
};
