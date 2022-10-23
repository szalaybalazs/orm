import { rmSync } from 'fs';
import { ensureDirSync, existsSync, mkdirSync, writeFile, readdirSync, rm } from 'fs-extra';
import { join } from 'path';
import { tLoadedEntity } from '../types';
import { generateExports, generateTypeForEntity } from './generate';

export const saveTypes = async (entities: tLoadedEntity[], directory: string) => {
  const types = entities.map((entity) => {
    return {
      key: entity.key,
      ...generateTypeForEntity(entity.key, entity),
    };
  });

  const basePath = join(process.cwd(), directory, 'entities');
  if (!existsSync(basePath)) mkdirSync(basePath);

  ensureDirSync(basePath);

  const currentFiles = readdirSync(basePath);
  const removedFiles = currentFiles.filter((file) => {
    if (file === 'index.ts') return false;
    return !types.find(({ key }) => file === `${key}.ts`);
  });

  const removePromise = removedFiles.map(async (file) => {
    return rm(join(basePath, file));
  });
  const savePromise = types.map(async ({ key, type }) => {
    await writeFile(join(basePath, `${key}.ts`), type, 'utf-8');
  });
  const indexPromise = writeFile(join(basePath, 'index.ts'), generateExports(types), 'utf-8');
  await Promise.all([...removePromise, ...savePromise, indexPromise]);
};
