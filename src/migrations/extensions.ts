import { QueryFunction } from '../drivers/pg';
import { iTables, tRegularColumn } from '../types/entity';

type tExtension = 'uuid';

export const createExtensions = async (state: iTables, query: QueryFunction) => {
  const queries = createExtensionQueries(state);
  await Promise.all(queries.map((sql) => query(sql)));
};

export const createExtensionQueries = (state: iTables): string[] => {
  const extensions: tExtension[] = [];
  const tableList = Object.values(state).map((table) => (table.type !== 'VIEW' && Object.values(table.columns)) || []);
  const columns: tRegularColumn[] = tableList.flat().filter((c) => c.kind === 'REGULAR') as tRegularColumn[];
  const types = columns.map((column) => column.type);

  if (types.includes('uuid')) extensions.push('uuid');

  return extensions.map(createSql).flat();
};

const getExtensionName = (extension: tExtension): string[] => {
  if (extension === 'uuid') return ['"uuid-ossp"'];
};

const createSql = (extension: tExtension) => {
  const names = getExtensionName(extension);
  return names.map((name) => `CREATE EXTENSION IF NOT EXISTS ${name}`);
};
