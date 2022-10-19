import { iChange, iChangeEntry, iChanges, iTableChanges } from '../types/changes';
import { iTableEntity, iTables, tColumn } from '../types/entity';

export const getChangesForColumn = (oldColumn: tColumn, newColumn: tColumn): iChange[] => {
  const changes: iChange[] = [];

  const allKeys = [...Object.keys(oldColumn), ...Object.keys(newColumn)];
  const keys = Array.from(new Set(allKeys));

  keys.forEach((key) => {
    const oldValue = oldColumn[key];
    const newValue = newColumn[key];

    if (oldValue === newValue) return;

    changes.push({ key, from: oldValue, to: newValue });
  });

  return changes;
};

interface iFieldChanges {
  [key: string]: tColumn;
}
export const getChangesForTables = (oldEntity: iTableEntity, newEntity: iTableEntity): iTableChanges => {
  const changes: { [key: string]: iChange[] } = {};

  const oldFields = Object.keys(oldEntity.columns);
  const newFields = Object.keys(newEntity.columns);
  const existingFields = oldFields.filter((field) => newFields.includes(field));

  const dropped = oldFields.filter((field) => !newFields.includes(field));

  const added: any = newFields
    .filter((field) => !oldFields.includes(field))
    .reduce((acc, field) => ({ ...acc, [field]: newEntity.columns[field] }), {} as iChangeEntry) as iChangeEntry;

  existingFields.forEach((field) => {
    const fieldChanges = getChangesForColumn(oldEntity.columns[field], newEntity.columns[field]);
    if (fieldChanges.length > 0) changes[field] = fieldChanges;
  });

  return { changes, dropped, added };
};

/**
 * Get changes to be generated to the migrations
 * @param snapshot previous state
 * @param state current state
 * @returns
 */
export const getChangesBetweenMigrations = (snapshot: iTables, state: iTables): iChanges => {
  const currentTables = Object.keys(state).map((key) => state[key]?.name || key);
  const previousTables = Object.keys(snapshot).map((key) => snapshot[key]?.name || key);

  const deletedTables = previousTables.filter((table) => !currentTables.includes(table));
  const createdTables = currentTables.filter((table) => !previousTables.includes(table));

  const updatedTables = previousTables.filter((table) => currentTables.includes(table));

  const changes = updatedTables.map((key) => {
    let changes: iTableChanges = { changes: {}, dropped: [], added: {} };

    if (snapshot[key]?.type !== 'VIEW') {
      const oldTable = getTable(snapshot, key);
      const newTable = getTable(state, key);
      changes = getChangesForTables(oldTable, newTable);
    }

    const allChanges = Object.values(changes).map((f) => Object.values(f));

    if (allChanges.flat().length === 0) return undefined;
    return { key, changes };
  });

  return {
    deleted: deletedTables,
    created: createdTables,
    updated: changes.filter(Boolean),
  };
};

const getTable = (snapshot: iTables, key: string) => {
  return (snapshot[key] ?? Object.values(snapshot).find((table) => table.name === key)) as iTableEntity;
};
