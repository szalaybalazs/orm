import { iTableChanges, iTableEntity, tColumn } from '../types';
import { iForeignDefinition } from '../types/column';
import { changeColumn, createColumn, getColumn } from './column';
import { editComment } from './comment';
import { createForeignKey, dropForeignKey } from './foreign';
import { createIndex, createIndicesForTable, dropIndex } from './indices';
import { changePrimaries, getPrimaryKeys } from './primary';
import { createTrigger, dropTrigger, updateTriggerFunction } from './trigger';

/**
 * Create table creation query
 * @param table table configuration
 * @returns SQL Query
 */
export const createTable = async (table: iTableEntity): Promise<string[]> => {
  const columnsPromise = Object.keys(table.columns).map((key) => createColumn(table.name, key, getColumn(table, key)));
  const columns = await Promise.all(columnsPromise);

  const primaryKeys = getPrimaryKeys(table);
  const primary = primaryKeys.length && `PRIMARY KEY (${primaryKeys})`;

  const sql = `CREATE TABLE IF NOT EXISTS "__SCHEMA__"."${table.name}" (${[columns, primary]
    .flat()
    .filter((f) => !!f?.trim?.())});`;

  const comments = Object.entries(table.columns).map(([key, { comment }]) => {
    if (!comment) return null;
    // todo: only remove comment if column exists
    return editComment(table.name, key, comment);
  });

  const indices = createIndicesForTable(table);

  return [sql, ...indices, ...comments].flat().filter(Boolean);
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
  state: iTableEntity,
  snapshot: iTableEntity,
): Promise<[string[], string[]]> => {
  const up: string[] = [];
  const down: string[] = [];

  const tableUp: string[] = [];
  const tableDown: string[] = [];
  const tableComputedUp: string[] = [];
  const tableComputedDown: string[] = [];

  const added = Object.keys(changes.added).map(async (key) => {
    tableUp.push(`ADD COLUMN ${await createColumn(state.name, key, getColumn(state, key))}`);
    tableDown.push(`DROP COLUMN "${key}"`);
  });

  const dropped = changes.dropped.map(async (key) => {
    // Drop column
    tableUp.push(`DROP COLUMN "${key}"`);

    // Add column when reverting
    tableDown.push(`ADD COLUMN ${await createColumn(state.name, key, getColumn(snapshot, key))}`);
  });

  const updates = Object.keys(changes.changes).map(async (key) => {
    const column = getColumn(state, key);
    const prevColumn = getColumn(snapshot, key);

    if (column.kind === 'RESOLVED') return;
    if (column.kind === 'COMPUTED') {
      if (prevColumn) tableComputedUp.push(`DROP COLUMN IF EXISTS "${key}"`);
      tableComputedUp.push(`ADD COLUMN IF NOT EXISTS ${await createColumn(state.name, key, column)}`);

      tableComputedDown.push(`DROP COLUMN IF EXISTS "${key}"`);
      if (prevColumn) {
        const prevColumnDef = await createColumn(state.name, key, prevColumn as tColumn);
        tableComputedDown.push(`ADD COLUMN IF NOT EXISTS ${prevColumnDef}`);
      }
    } else {
      const promises = changes.changes[key].map(async (change) => {
        // todo: handle column kind change

        const {
          tableUp: _tableUp,
          tableDown: _tableDown,
          up: _up,
          down: _down,
        } = await changeColumn(state.name, key, column, prevColumn as any, change);

        tableUp.push(..._tableUp);
        tableDown.push(..._tableDown);

        up.push(..._up);
        down.push(..._down);
      });

      return await Promise.all(promises);
    }
  });

  await Promise.all([...added, ...dropped, ...updates]);

  changes.foreign?.added.forEach((foreign: iForeignDefinition) => {
    tableUp.push(`ADD ${createForeignKey(foreign)}`);
    tableDown.unshift(dropForeignKey(foreign));
  });

  changes.foreign?.dropped.forEach((foreign: iForeignDefinition) => {
    tableUp.unshift(dropForeignKey(foreign));
    tableDown.push(`ADD ${createForeignKey(foreign)}`);
  });

  if (tableUp.length) up.push(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableUp};`);
  if (tableDown.length) down.push(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableDown};`);

  // Moving generated column to second query to make sure all the columns exist when modifiyng
  if (tableComputedUp.length) up.push(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableComputedUp};`);
  if (tableComputedDown.length) down.push(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableComputedDown};`);

  changes.indices.dropped.forEach((index) => {
    up.push(...dropIndex(state.name, index.name, index.unique));

    down.push(...createIndex(state.name, index));
  });

  changes.indices.updated.forEach((index) => {
    up.push(...dropIndex(state.name, index.from.name, index.from.unique));
    up.push(...createIndex(state.name, index.to));

    down.push(...dropIndex(state.name, index.to.name, index.to.unique));
    down.push(...createIndex(state.name, index.from));
  });

  changes.indices.created.forEach((index) => {
    up.push(...createIndex(state.name, index));

    down.push(...dropIndex(state.name, index.name, index.unique));
  });

  Object.entries(changes.comments).forEach(([key, { from, to }]) => {
    if (state.columns?.[key]) up.push(editComment(state.name, key, to));
    if (snapshot.columns?.[key]) down.push(editComment(state.name, key, from));
  });

  if (changes.triggers?.change === 'CREATE') {
    up.push(...(await createTrigger(state, changes.triggers.created)));
    down.push(...(await dropTrigger(state)));
  } else if (changes.triggers?.change === 'DELETE') {
    up.push(...(await dropTrigger(snapshot)));
    down.push(...(await createTrigger(snapshot, changes.triggers.deleted)));
  } else if (changes.triggers?.change === 'UPDATE') {
    up.push(await updateTriggerFunction(state));
    down.push(await updateTriggerFunction(snapshot));
  }

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
