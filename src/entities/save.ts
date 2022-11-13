import { emptyDir, pathExists, writeFile } from 'fs-extra';
import { join } from 'path';
import { format } from 'prettier';
import { formatId } from '../core/id';
import { tEntity } from '../types';

const template = `
import { tEntity } from '../../src/types/entity';

const __KEY__: tEntity = __ENTITY__

export default __KEY__;
`;

export const saveEntities = async (entities: { [key: string]: tEntity }, entitiesDir: string) => {
  const base = entitiesDir;
  const paths = Object.keys(entities).map((key) => join(base, `${key}.entity.ts`));
  const existPromise = paths.map(pathExists);

  const exists = await Promise.all(existPromise);
  const anyExists = exists.some(Boolean);

  if (anyExists) {
    // todo: ask for confirmation
    console.log('Entities already existing, recreating directory...');
    await emptyDir(base);
  }

  const savePromises = Object.keys(entities).map((key) => {
    // @ts-ignore
    const entity = entities[key];
    if (!entity) return;

    const content = template
      .replace(/__KEY__/g, formatId(key))
      .replace(/__ENTITY__/g, JSON.stringify({ ...entity, key: undefined }));

    return writeFile(join(base, `${key}.entity.ts`), format(content, { parser: 'babel-ts' }), 'utf8');
  });

  await Promise.all(savePromises);
};
