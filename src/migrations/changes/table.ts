import { iChange, iChangeEntry, iTableChanges, iTableEntity } from '../../types';
import { getChangesForColumn } from './column';
import { getIndexChanges } from './indices';

/**
 * Generates all the changes for columns
 * @param oldEntity old table definition
 * @param newEntity new table definition
 * @returns
 */
export const getChangesForTables = (key: string, oldEntity: iTableEntity, newEntity: iTableEntity): iTableChanges => {
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

  const indices = getIndexChanges(key, oldEntity.indices ?? [], newEntity?.indices ?? []);

  return { changes, dropped, added, indices };
};
