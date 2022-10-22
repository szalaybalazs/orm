import { iIndex } from '../types';

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
