import { Command } from 'commander';
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
        await saveTypes(entities, options.typesDirectory);
      } catch (error) {
        console.log(error);
      }
    });
};
