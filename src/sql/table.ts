import { iTableChanges, iTableEntity, tColumn, tEntity } from '../types';
import { changeColumn, createColumn } from './column';
import { createIndex, dropIndex } from './indices';
import { changePrimaries, getPrimaryKeys } from './primary';

/**
 * Create table creation query
 * @param table table configuration
 * @returns SQL Query
 */
export const createTable = async (table: iTableEntity): Promise<string> => {
  // todo: use column name option
  // todo: use naming convention
  const columnsPromise = Object.keys(table.columns).map((key) => createColumn(key, table.columns[key]));
  const columns = await Promise.all(columnsPromise);

  const primaryKeys = getPrimaryKeys(table);
  const primary = primaryKeys.length && `PRIMARY KEY (${primaryKeys})`;

  const sql = `CREATE TABLE IF NOT EXISTS "__SCHEMA__"."${table.name}" (${[columns, primary].filter(Boolean)});`;

  return sql;
};

/**
 * Generate changes inside a single table
 * @param changes changes in the table
 * @param state current schema
 * @param snapshot previous table schema
 * @returns
 */
export const updateTable = async (
  changes: iTableChanges,
  state: tEntity,
  snapshot: tEntity,
): Promise<[string[], string[]]> => {
  const up: string[] = [];
  const down: string[] = [];

  const tableUp: string[] = [];
  const tableDown: string[] = [];
  const tableComputedUp: string[] = [];
  const tableComputedDown: string[] = [];

  if (state.type === 'VIEW') return [[], []];

  const added = Object.keys(changes.added).map(async (key) => {
    tableUp.push(`ADD COLUMN ${await createColumn(key, state.columns[key])}`);
    tableDown.push(`DROP COLUMN "${key}"`);
  });

  const dropped = changes.dropped.map(async (key) => {
    // Drop column
    tableUp.push(`DROP COLUMN "${key}"`);

    // Add column when reverting
    if (snapshot.type !== 'VIEW') {
      tableDown.push(`ADD COLUMN ${await createColumn(key, snapshot.columns[key])}`);
    }
  });

  const updates = Object.keys(changes.changes).map(async (key) => {
    const column = state.columns[key];
    const prevColumn = snapshot.columns[key];

    if (column.kind === 'RESOLVED') return;
    if (column.kind === 'COMPUTED') {
      if (prevColumn) tableComputedUp.push(`DROP COLUMN IF EXISTS "${key}"`);
      tableComputedUp.push(`ADD COLUMN IF NOT EXISTS ${await createColumn(key, column)}`);

      tableComputedDown.push(`DROP COLUMN IF EXISTS "${key}"`);
      if (prevColumn)
        tableComputedDown.push(`ADD COLUMN IF NOT EXISTS ${await createColumn(key, prevColumn as tColumn)}`);
    } else {
      const promises = changes.changes[key].map(async (change) => {
        const { up, down } = await changeColumn(key, column, change);

        tableUp.push(up);
        tableDown.push(down);
      });
      return await Promise.all(promises);
    }
  });

  await Promise.all([...added, ...dropped, ...updates]);

  if (tableUp.length) up.push(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableUp};`);
  if (tableDown.length) down.push(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableDown};`);

  // Moving generated column to second query to make sure all the columns exist when modifiyng
  if (tableComputedUp.length) up.push(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableComputedUp};`);
  if (tableComputedDown.length) down.push(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableComputedDown};`);

  changes.indices.dropped.forEach((index) => {
    up.push(dropIndex(index.name));

    down.push(createIndex(state.name, index));
  });

  changes.indices.updated.forEach((index) => {
    up.push(dropIndex(index.from.name));
    up.push(createIndex(state.name, index.to));

    down.push(dropIndex(index.to.name));
    down.push(createIndex(state.name, index.from));
  });

  changes.indices.created.forEach((index) => {
    up.push(createIndex(state.name, index));

    down.push(`DROP INDEX IF EXISTS "__SCHEMA__"."${index.name}" CASCADE`);
  });

  // todo: handle unique values by created a separate index for each of them
  // So the uniqueness can be dropped by dropping the underlying index

  const [primariesUp, primariesDown] = changePrimaries(changes, state, snapshot);
  return [[...up, ...primariesUp].filter(Boolean), [...down, ...primariesDown].filter(Boolean)];
};

/**
 * Drop table from database
 * @param name name of the table
 * @returns SQL Query
 */
export const dropTable = (name: string): string => {
  return `DROP TABLE IF EXISTS "__SCHEMA__"."${name}" CASCADE;`;
};
