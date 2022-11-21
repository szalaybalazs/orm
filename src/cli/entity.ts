import * as chalk from 'chalk';
import { Command } from 'commander';
import { pathExistsSync } from 'fs-extra';
import { join } from 'path';
import { parseConfig } from '../core/config';
import { formatId } from '../core/id';
import { broadcast, debug } from '../core/log';
import { getEmptyEntityContent } from '../entities/template';
import { writeEntity } from '../entities/write';
import { addOptions } from './options';

export const createEntityProgram = (program: Command) => {
  addOptions(program.command('entity:create'))
    .description('Create new, empty entities')
    .argument('<name>', 'The name of the new entity')
    .action(async (input, params) => {
      try {
        const name = formatId(input);
        const options = await parseConfig(params);
        const content = getEmptyEntityContent(name);

        debug(chalk.dim(`Writing new entity: ${name}...`));

        const entityPath = await writeEntity(name, options.entitiesDirectory, content);

        debug(chalk.dim(`Entity saved in dir: ${options.entitiesDirectory}`));

        broadcast(chalk.bold('Entity successfully created! 🥳'));
        broadcast(chalk.dim('To start editing open'), chalk.cyan(entityPath));
      } catch (error) {
        if (error.message === 'EXISTS') {
          broadcast(chalk.red('[ERROR]'), chalk.reset('Entity already exists, skipping...'));
        } else broadcast(error);
      }
    });
};
