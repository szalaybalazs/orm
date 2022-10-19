import { join } from 'path';
import { readdir } from 'fs-extra';
import { iTableEntity, iTables, tEntity } from '../types/entity';

const validExtensions = ['.entity.ts', '.entity.js', '.entity.json'];

export const loadEntities = async (directory: string): Promise<tEntity[]> => {
  const path = join(process.cwd(), directory);
  const content = await readdir(path);

  const entities = content.filter((file) => validExtensions.some((ext) => file.endsWith(ext)));

  const modules = await Promise.all(
    entities.map(async (entity) => {
      const entityPath = join(path, entity);

      // Loading json entity
      if (entity.endsWith('.json')) {
        return require(entityPath);
      }

      // Loading from JS or TS file
      if (entity.endsWith('.js') || entity.endsWith('.ts')) {
        const module = await import(entityPath).catch(() => null);

        if (!module) return null;

        module.default.key = entity.replace(/\.entity\..+/, '');

        // todo: find correct export automatically
        return module.default;
      }
    }),
  );

  return modules.filter(Boolean);
};

export const getTables = (entities: tEntity[]): iTables => {
  const tables = entities.filter((e) => e.type !== 'VIEW') as iTableEntity[];

  return tables.reduce((acc, table) => ({ ...acc, [table.name]: table }), {});
};
