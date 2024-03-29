import { compareObjects } from '../../core/compare';
import { iChange, tColumn } from '../../types';

const FIELD_BLACKLIST = ['comment', 'enum', 'reference', 'onUpdate', 'onDelete', 'onInsert'];

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

    // enums changes are checked for as 'types'
    if (oldValue === newValue || FIELD_BLACKLIST.includes(key)) return;
    if (oldValue && newValue && compareObjects(oldValue, newValue)) return;

    changes.push({ key, from: oldValue, to: newValue });
  });

  return changes;
};
