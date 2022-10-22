import { iChange, tColumn } from '../../types';

/**
 * List all the changes for columns
 * @param oldColumn old column definition
 * @param newColumn new column definition
 * @returns changes
 */
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
