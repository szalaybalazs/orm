import { iTableChangeInput } from '.';
import { compareObjects } from '../../core/compare';
import { getColumn } from '../../sql/column';
import { iTableEntity, iTables } from '../../types';
import { iForeignChanges } from '../../types/changes';
import { iForeignDefinition, tRegularColumn } from '../../types/column';

/**
 * Get the changes in the foreign keys
 * @param change input
 * @returns foreign changes
 */
export const getForeignKeyChanges = ({ state, snapshot }: iTableChangeInput): iForeignChanges => {
  const previous = getForeignKeys(snapshot);
  const current = getForeignKeys(state);

  const previousNames = previous.map((fk) => fk.name);
  const currentNames = current.map((fk) => fk.name);

  const added = current.filter((fk) => !previousNames.includes(fk.name));
  const dropped = previous.filter((fk) => !currentNames.includes(fk.name));

  previous.forEach((previousKey) => {
    const currentKey = current.find((fk) => fk.name === previousKey.name);
    if (!currentKey) return;
    if (compareObjects(currentKey, previousKey)) return;
    added.push(currentKey);
    dropped.push(previousKey);
  });

  return { dropped, added };
};

/**
 * Get foreign keys of table
 * @param table table configuration
 * @returns foreign key definitions
 */
export const getForeignKeys = (table: iTableEntity): iForeignDefinition[] => {
  const columns = Object.keys(table.columns);
  const foreignColumns = columns.filter((key) => {
    const column = getColumn(table, key);

    if (column.kind === 'COMPUTED') return false;
    if (column.kind === 'RESOLVED') return false;
    if (!column.reference) return false;

    return true;
  });

  return foreignColumns.map((source) => {
    const column = getColumn(table, source) as tRegularColumn; // satisfies tRegularColumn;

    const definition = {
      ...(column as any).reference,
      source,
    };

    return {
      ...definition,
      name: getForeignKeyName(table.name, definition),
    };
  });
};

export const getForeignKeyName = (table: string, foreign: iForeignDefinition) => {
  return `${table}_${foreign.source}_fkey`;
};
