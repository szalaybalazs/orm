import * as chalk from 'chalk';
import { Command } from 'commander';
import { parseConfig } from '../core/config';
import { formatId } from '../core/id';
import { debug } from '../core/log';
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
        debug(params.verbose, chalk.gray('Saving new entity...'));
        await writeEntity(name, options.entities, content);
      } catch (error) {
        // todo: handle config errors
        if (error.message === 'NO_CHANGES') console.log(chalk.reset('No changes found in schema...'));
        else console.log(error);
      }
    });
};
