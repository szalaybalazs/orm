import { type } from 'os';
import { format } from 'prettier';
import { capitalize } from '../core/capitalize';
import { iRegularColumnOptions, tEntity } from '../types';
import { formatComment } from './comment';
import { getType } from './parse';

const template = `// ==========
// THIS IS AN AUTOMATICALLY GENERATED FILE
// To modify this type create a new type outside the "entities" directory and extend it
// ==========

__COMMENT__export type __NAME__ = {
  __CONTENT__
}`;

/**
 * Generate type script for a single entity
 * @param key kef of the entity
 * @param entity entity config
 * @returns name and type-string
 */
export const generateTypeForEntity = (key: string, entity: tEntity): { name: string; type: string } => {
  if (entity.type === 'FUNCTION') return;
  const name = `${capitalize(entity.name || key)}Entity`;

  const columns = Object.keys(entity.columns);
  const types = columns.map((key) => {
    const column = entity.columns[key];
    const type = typeof column === 'string' ? column : column.type;
    const commentContent = (typeof column !== 'string' && column.comment) || '';
    const comment = formatComment(commentContent);
    const nullable = !!(typeof column !== 'string' && (column as iRegularColumnOptions).nullable);

    return `${comment}${key}${nullable ? '?' : ''}: ${getType(type)}`;
  });

  const entityComment = entity.comment || `Type for the ${name} entity`;

  const content = template
    .replace(/__NAME__/g, name)
    .replace(/__CONTENT__/g, types.join(';\n\n'))
    .replace(/__COMMENT__/g, formatComment(entityComment));

  return { name, type: format(content, { parser: 'babel-ts' }) };
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
export const generateExports = (types: { key: string; name: string }[]) => {
  const exports = types.map(({ name, key }) => `export type { ${name} } from './${key}';`);

  return format(indexTemplate.replace(/__EXPORTS__/g, exports.join('\n')), { parser: 'babel-ts' });
};
