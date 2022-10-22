import { eUpdate, iChanges, iTableChanges } from '../../types/changes';
import { iTableEntity, iTables, iViewEntity } from '../../types/entity';
import { getIndexChanges } from './indices';
import { getChangesForTables } from './table';
import { getChangesForViews } from './view';

// todo: handle views

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

  const changes = updatedTables.map((key): eUpdate => {
    if (snapshot[key]?.type === 'VIEW') {
      const oldView = getView(snapshot, key);
      const newView = getView(state, key);
      const changes = getChangesForViews(oldView, newView);

      if (Object.keys(changes).every((c) => ['kind', 'replace'].includes(c))) return undefined;
      return { key, kind: 'VIEW', changes };
    } else {
      const oldTable = getTable(snapshot, key);
      const newTable = getTable(state, key);

      const changes = getChangesForTables(key, oldTable, newTable);

      const allChanges = Object.values(changes).map((f) => Object.values(f));

      if (allChanges.flat(100).length === 0) return undefined;
      return { key, changes };
    }
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
const getView = (snapshot: iTables, key: string) => {
  return (snapshot[key] ?? Object.values(snapshot).find((table) => table.name === key)) as iViewEntity;
};