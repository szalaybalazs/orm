import * as chalk from 'chalk';
import { Command } from 'commander';

export const createBannerProgram = (program: Command) => {
  program
    .command('show')
    .description('Show Orm ASCII Text')
    .action(async () => {
      console.log;
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
};
