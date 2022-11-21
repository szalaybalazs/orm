import { chalk } from '../core/chalk';
import { broadcast } from '../core/log';
import { getIndexChanges, getIndexName } from '../migrations/changes/indices';
import { iIndex, iTableEntity } from '../types';
// todo: prevent duplicates
/**
 * Create index based on configuration on table
 * @param table name of the target table
 * @param index index configuration
 * @returns SQL query
 */
export const createIndex = (table: string, index: iIndex): string => {
  const columns = index.columns.map((column) => {
    if (typeof column === 'string') return `"${column}"`;

    return `"${column.column}" ${column.order ?? ''} ${column.nulls ? `NULLS ${column.nulls}` : ''}`.trim();
  });

  const method = index.method ? `USING ${index.method}` : '';
  const include = index.includes?.length ? `INCLUDE (${index.includes})` : '';

  return `
    CREATE ${index.unique ? 'UNIQUE' : ''} INDEX 
    "${index.name}" ON "__SCHEMA__"."${table}" ${method}
    (${columns}) ${include}
  `;
};

/**
 * Create DROP INDEX query
 * @param name name of the index
 * @returns SQL query
 */
export const dropIndex = (name: string) => {
  return `DROP INDEX IF EXISTS "__SCHEMA__"."${name}" CASCADE`;
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
