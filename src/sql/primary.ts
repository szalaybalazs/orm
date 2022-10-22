import { iTableChanges, iTableEntity, tEntity } from '../types';

/**
 * Get primary keys of table
 * @param table table configuration
 * @returns SQL formatted column list
 */
export const getPrimaryKeys = (table: iTableEntity): string[] => {
  const columns = Object.keys(table.columns);
  const primaryColumns = columns.filter((key) => {
    const column = table.columns[key];

    if (column.kind === 'COMPUTED') return false;
    if (column.kind === 'RESOLVED') return false;

    return column.primary;
  });

  return primaryColumns.map((key) => `"${key}"`);
};

/**
 * Generated primary change queries
 * @param changes
 * @param state
 * @param snapshot
 * @returns
 */
export const changePrimaries = (changes: iTableChanges, state: tEntity, snapshot: tEntity): [string[], string[]] => {
  const up: string[] = [];
  const down: string[] = [];

  if (state.type === 'VIEW') return;
  if (snapshot.type === 'VIEW') return;

  const allChanges = Object.values(changes.changes).flat();
  const isPrimaryColumnChanged = allChanges.find((change) => change.key === 'primary');

  if (isPrimaryColumnChanged) {
    // Dropping primaries before any change
    const drop = dropPrimaries(state.name);
    up.push(drop);
    down.push(drop);

    up.push(createPrimaries(state));
    down.push(createPrimaries(snapshot));
  }

  return [up.filter(Boolean), down.filter(Boolean)];
};

/**
 * Add primaries to table
 * @param state table configuration
 * @returns SQL Query or null
 */
export const createPrimaries = (state: iTableEntity): string | null => {
  const primaries = getPrimaryKeys(state);
  if (primaries.length > 0) return `ALTER TABLE "__SCHEMA__".${state.name} ADD PRIMARY KEY (${primaries});`;

  return null;
};

/**
 * Drop primaries from table
 * @param table name of target table
 * @returns SQL Query
 */
export const dropPrimaries = (table: string): string => {
  return `ALTER TABLE "__SCHEMA__"."${table}" DROP CONSTRAINT "${table}_pkey";`;
};
