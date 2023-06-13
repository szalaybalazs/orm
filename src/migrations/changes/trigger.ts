import { deepEqual } from '../../core/object';
import { iTableEntity, tColumn } from '../../types';
import { iTriggerChange, iTriggerChanges } from '../../types/changes';
import { iUpdaterFunction } from '../../types/column';

const getUpdatedColumns = (table: iTableEntity): iTriggerChange[] => {
  const columns = Object.keys(table.columns);
  const updated = columns.map((key) => {
    const column = table.columns[key];
    if (column.kind === 'RESOLVED') return false;
    if (column.kind === 'COMPUTED') return false;
    if (!column.onUpdate) return false;
    return { key, ...column.onUpdate };
  });

  return updated.filter(Boolean) as ({ key: string } & iUpdaterFunction<any>)[];
};

export const getTriggerChanges = (oldTable: iTableEntity, newTable: iTableEntity): Partial<iTriggerChanges> => {
  const oldColumns = getUpdatedColumns(oldTable);
  const newColumns = getUpdatedColumns(newTable);
  const updatedColumns = oldColumns.filter((col) => {
    const newCol = newColumns.find((c) => c.key === col.key);
    if (!newCol) return false;
    return !deepEqual(col, newCol);
  });

  const created = newColumns.filter((column) => !oldColumns.find((oldColumn) => oldColumn.key === column.key));
  const deleted = oldColumns.filter((column) => !newColumns.find((newColumn) => newColumn.key === column.key));
  const updated = updatedColumns.map(({ key }) => {
    const from = oldColumns.find((col) => col.key === key);
    const to = newColumns.find((col) => col.key === key);
    return { key, from, to };
  });
  const changes = created.length + deleted.length + updated.length;

  const change =
    oldColumns.length > 0 && newColumns.length > 0 ? 'UPDATE' : oldColumns.length > 0 ? 'DELETE' : 'CREATE';

  if (changes === 0) return {};
  return { created, deleted, updated, change };
};
