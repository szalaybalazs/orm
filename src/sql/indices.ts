import { chalk } from '../core/chalk';
import { broadcast } from '../core/log';
import { convertKey } from '../core/naming';
import { getIndexChanges, getIndexName } from '../migrations/changes/indices';
import { iIndex, iTableEntity } from '../types';
// todo: prevent duplicates
/**
 * Create index based on configuration on table
 * @param table name of the target table
 * @param index index configuration
 * @returns SQL query
 */
export const createIndex = (table: string, index: iIndex): string[] => {
  const columns = index.columns.map((column) => {
    if (typeof column === 'string') return `"${convertKey(column, 'SNAKE')}"`;

    const col = convertKey(column.column, 'SNAKE');
    return `"${col}" ${column.order ?? ''} ${column.nulls ? `NULLS ${column.nulls}` : ''}`.trim();
  });

  const method = index.method ? `USING ${index.method}` : '';
  const include = index.includes?.length
    ? `INCLUDE (${index.includes.map((column) => {
        if (typeof column === 'string') return `"${convertKey(column, 'SNAKE')}"`;
        return `"${convertKey(column.column, 'SNAKE')}"`.trim();
      })})`
    : '';

  const where = index.where ? `WHERE ${index.where}` : '';

  const unique = index.unique ? 'UNIQUE' : '';
  const queries = [
    `
      CREATE ${unique} INDEX 
      "${index.name}" ON "__SCHEMA__"."${table}" ${method}
      (${columns}) ${include}
      ${where}
    `,
  ];

  if (index.unique) {
    queries.push(`
      ALTER TABLE "__SCHEMA__"."${table}" 
      ADD CONSTRAINT "${index.name}" ${unique} 
      USING INDEX "${index.name}"
    `);
  }

  return queries;
};

/**
 * Create DROP INDEX query
 * @param table name of the parent table
 * @param name name of the index
 * @param unique wether the index was unique
 * @returns SQL query
 */
export const dropIndex = (table: string, name: string, unique: boolean) => {
  const queries = [`ALTER TABLE "__SCHEMA__"."${table}" DROP CONSTRAINT "${name}" CASCADE`];

  if (unique) {
    queries.push(`DROP INDEX IF EXISTS "__SCHEMA__"."${name}" CASCADE`);
  }

  return queries;
};

export const createIndicesForTable = (table: iTableEntity) => {
  const indices = table.indices?.map((index) => ({ ...index, name: getIndexName(table.name, index) }));
  if (!indices || !indices.length) return [];

  const names = Array.from(new Set(indices.map((i) => i.name)));
  if (names && indices && names?.length !== indices?.length) {
    broadcast('');
    broadcast(
      chalk.yellow('[WARNING]: '),
      chalk.reset('Two or more index uses the same name. Only one will be created!'),
    );
    broadcast('');
  }

  return names.map((name) => {
    const index = indices.find((i) => i.name === name);
    return createIndex(table.name, index);
  });
};
