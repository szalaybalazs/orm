import { join } from 'path';
import { readdir } from 'fs-extra';

const validExtensions = ['.ts', '.js', '.json'];

export const loadEntities = async (directory: string) => {
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
        const module = await import(entityPath);

        // todo: find correct export automatically
        return module.default;
      }
    }),
  );

  return modules.filter(Boolean);
  // console.log(path);
};
