// @ts-nocheck

import * as chalk from 'chalk';
import { execSync } from 'child_process';
import { Command } from 'commander';
import { prefix } from '../core/prefix';

/**
 * Create PostgresORM banner command
 * @param program commander program
 */
export const createBannerProgram = (program: Command) => {
  program
    .command('banner')
    .summary('Show banner')
    .description('Show PostgresORM ASCII Banner')
    .option('-t, --title <title>', 'Title to be displayed')
    .option('-st, --subtitle <subtitle>', 'Subtitle to be displayed')
    .option('-c, --center', 'Wether to center the text')
    .action(async (options) => {
      const figlet = await import('figlet');

      const cols = process.stdout.columns;

      const command = `figlet ${options.center ? '-c' : ''} -w ${cols} '${options.title || 'PostgresORM'}'`;
      console.log(command);
      const res = execSync(command.replace(/\n/g, '')); //figlet.textSync(options.title || 'PostgresORM', { width });
      const banner = prefix(String(res), options.center ? 0 : 8);

      const subtitleText = options.subtitle || 'Advanced PostgreSQL focused ORM and Query Builder';
      const subtitle = prefix(subtitleText, options.center ? Math.round((cols - subtitleText.length) / 2) : 9);
      const log = [prefix('', 60, '\n'), chalk.cyan(banner), chalk.dim(subtitle), prefix('', 60, '\n')];

      log.map((log) => console.log(log));
    });
};
