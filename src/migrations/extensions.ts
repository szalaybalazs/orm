import { QueryFunction } from '../drivers/pg';
import { eExtension, iTables, tRegularColumn } from '../types';

/**
 * Generate extension creation queries
 * @param state current schema state
 * @param query Query function
 */
export const createExtensions = async (state: iTables, query: QueryFunction): Promise<void> => {
  const queries = createExtensionQueries(state);
  await Promise.all(queries.map((sql) => query(sql)));
};

/**
 * Generate extension creation queries
 * @param state current schema state
 * @returns queries
 */
export const createExtensionQueries = (state: iTables): string[] => {
  const extensions: Set<eExtension> = new Set();
  const tableList = Object.values(state).map(
    (table) => (table.type !== 'VIEW' && table.type !== 'FUNCTION' && Object.values(table.columns)) || [],
  );
  const columns: tRegularColumn[] = tableList.flat().filter((c) => c.kind === 'REGULAR') as tRegularColumn[];
  const types = columns.map((column) => column.type);

  if (types.includes('uuid')) extensions.add('uuid');

  return Array.from(extensions).map(createSql).flat();
};

/**
 * Generate creation query
 * @param extension extension name
 * @returns
 */
const createSql = (extension: eExtension): string[] => {
  const names = getExtensionName(extension);
  return names.map((name) => `CREATE EXTENSION IF NOT EXISTS ${name}`);
};

/**
 * Get the official name of the extension
 * @param extension internal extension identified
 * @returns extension names
 */
const getExtensionName = (extension: eExtension): string[] => {
  if (extension === 'uuid') return ['"uuid-ossp"'];
};
