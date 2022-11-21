import { emptyDir, pathExists, writeFile } from 'fs-extra';
import { join } from 'path';
import { format } from 'prettier';
import { formatId } from '../core/id';
import { broadcast } from '../core/log';
import { formatSql } from '../core/sql';
import { tEntity } from '../types';

const typeImport = process.env.NODE_ENV === 'development' ? './src/types' : 'undiorm/src/types';
const template = `
import { tEntity } from '${typeImport}';

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
    broadcast('Entities already existing, recreating directory...');
    await emptyDir(base);
  }

  const savePromises = Object.keys(entities).map((key) => {
    const entity: any = entities[key];
    if (!entity) return;

    const resolver = `"resolver": \`\n${formatSql(String(entity.resolver).replace(/\\n/g, '\n'))}\n\``;

    const entityContent = JSON.stringify({ ...entity, key: undefined }).replace(/"resolver":(\s+)?(".+")/, resolver);
    const content = template.replace(/__KEY__/g, formatId(key)).replace(/__ENTITY__/g, entityContent);

    return writeFile(join(base, `${key}.entity.ts`), format(content, { parser: 'babel-ts' }), 'utf8');
  });

  await Promise.all(savePromises);
};
