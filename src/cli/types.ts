import { Command } from 'commander';
import { chalk } from '../core/chalk';
import { parseConfig } from '../core/config';
import { loadEntities } from '../entities/load';
import { saveTypes } from '../typing';
import { addOptions } from './options';

export const generateEntityTypes = (program: Command) => {
  addOptions(program.command('types:generate'))
    .description('Generate entity types')
    .action(async (params) => {
      try {
        const options = await parseConfig(params);
        const entities = await loadEntities(options.entitiesDirectory);
        const directory = await saveTypes(entities, options.typesDirectory, options.namingConvention);

        console.log(chalk.bold('Types successfully generated 🎊'));
        console.log(chalk.reset('They have been saved at'), chalk.cyan(directory));
      } catch (error) {
        console.log(error);
      }
    });
};
