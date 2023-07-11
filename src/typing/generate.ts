import { format } from 'prettier';
import { convertKey, pascalize } from '../core/naming';
import { iRegularColumnOptions, tEntity, tRegularColumn } from '../types';
import { eNamingConvention } from '../types/config';
import { getEntitiyKeys } from '../utils';
import { formatComment } from './comment';
import { getType } from './parse';

const template = `// ==========
// THIS IS AN AUTOMATICALLY GENERATED FILE
// To modify this type create a new type outside the "entities" directory and extend it
// ==========

__COMMENT__export type __NAME__ = {
  __CONTENT__
}

__KEYS__
`;

const keysTemplate = `export const __NAME__ = [__KEYS__]`;

export const getKeys = (entity: tEntity, name: string) => {
  const keys = getEntitiyKeys(entity);
  return keysTemplate.replace(/__NAME__/g, name).replace(/__KEYS__/g, keys.map((key) => `'${key}'`).join(', '));
};

/**
 * Generate type script for a single entity
 * @param key kef of the entity
 * @param entity entity config
 * @returns name and type-string
 */
export const generateTypeForEntity = (
  key: string,
  entity: tEntity,
  namingConvention?: eNamingConvention,
  includeKeys?: boolean,
): { name: string; keysName?: string; type: string } => {
  if (entity.type === 'FUNCTION') return;
  const name = `${pascalize((entity.name || key).replace(/-/g, '_'))}Entity`;
  const keysName = `${pascalize((entity.name || key).replace(/-/g, '_'))}Keys`;

  const columns = Object.keys(entity.columns);
  const types = columns.map((key) => {
    const column = entity.columns[key];
    const type = typeof column === 'string' ? column : column.type;
    const commentContent = (typeof column !== 'string' && column.comment) || '';
    const comment = formatComment(commentContent);
    const nullable = !!(typeof column !== 'string' && (column as iRegularColumnOptions).nullable);

    return `${comment}'${convertKey(key, namingConvention)}'${nullable ? '?' : ''}: ${getType(
      type,
      (column as any).enum,
      (column as any).array,
    )}`;
  });

  const entityComment = entity.comment || `Type for the ${name} entity`;

  const content = template
    .replace(/__NAME__/g, name)
    .replace(/__CONTENT__/g, types.join(';\n\n'))
    .replace(/__COMMENT__/g, formatComment(entityComment))
    .replace(/__KEYS__/g, includeKeys ? getKeys(entity, keysName) : '');

  return { name, keysName: includeKeys ? keysName : undefined, type: format(content, { parser: 'babel-ts' }) };
};

const indexTemplate = `// =========
// THIS IS AN AUTOMATICALL GENERATED FILE
// ANY CHANGES WILL BE REVERTED AT THE NEXT MIGRATION
// =========

__EXPORTS__
`;

/**
 * Generated the index.ts file, including all the named exports
 * @param types type list
 * @returns file content
 */
export const generateExports = (types: { key: string; keysName?: string; name: string }[]) => {
  const exports = types.map(({ name, key, keysName }) => [
    `export type { ${name} } from './${key}';`,
    keysName && `export { ${keysName} } from './${key}'`,
  ]);

  const content = indexTemplate.replace(/__EXPORTS__/g, exports.flat().filter(Boolean).join('\n'));

  return format(content, { parser: 'babel-ts' });
};
