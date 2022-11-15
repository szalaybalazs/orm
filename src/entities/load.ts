import { join } from 'path';
import { readdir } from 'fs-extra';
import { iTables, tEntity } from '../types';
import { tLoadedEntity } from '../types';
import { chalk } from '../core/chalk';
import { debug } from '../core/log';
import { eNamingConvention } from '../types/config';
import { convertKey } from '../core/naming';

const validExtensions = ['.entity.ts', '.entity.js', '.entity.json'];

export const loadEntities = async (directory: string): Promise<tLoadedEntity[]> => {
  debug(chalk.dim(`> Loading entites from: ${directory}`));

  const content = await readdir(directory);

  const entities = content.filter((file) => validExtensions.some((ext) => file.endsWith(ext)));

  const modules = await Promise.all(
    entities.map(async (entity) => {
      const entityPath = join(directory, entity);

      // Loading json entity
      if (entity.endsWith('.json')) {
        return require(entityPath);
      }

      // Loading from JS or TS file
      if (entity.endsWith('.js') || entity.endsWith('.ts')) {
        const module = await import(entityPath).catch(() => null);

        if (!module) {
          debug(chalk.dim(`> No default export was found for entity: '${entity}', returning null...`));
          return null;
        }

        module.default.key = entity.replace(/\.entity\..+/, '');

        // todo: find correct export automatically
        return module.default;
      }
    }),
  );

  return modules.filter(Boolean);
};

/**
 * Generate entity map from array
 *
 * Converts column keys to snake case
 * @param entities input array
 * @returns { [key: string]: entity } map
 */
export const getEntities = (entities: tEntity[]): iTables => {
  debug(chalk.dim('> Formatting entities...'));
  const entityList = entities.map((entity) => {
    if (entity.type === 'FUNCTION') return entity;
    return {
      ...entity,
      columns: Object.keys(entity.columns).reduce(
        (acc, key) => ({ ...acc, [convertKey(key, 'SNAKE')]: entity.columns[key] }),
        {},
      ),
    };
  });

  return entityList.reduce((acc, table) => ({ ...acc, [table.name]: table }), {});
};
