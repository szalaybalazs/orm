import { deepEqual } from '../../core/object';
import { iTableEntity } from '../../types';
import { eTriggerChange, iTriggerChanges } from '../../types/changes';
import { eTriggerType, iUpdaterFunction, tRegularColumn } from '../../types/column';
import { iProcedure } from '../../types/entity';

interface iUpdaters {
  old: { key: string; updater: iUpdaterFunction<any> }[];
  new: { key: string; updater: iUpdaterFunction<any> }[];
}
interface iProcedures {
  old: iProcedure;
  new: iProcedure;
}

/**
 * Get change for a list of updaters and procedures
 * @param updaters
 * @param procedures
 * @returns
 */
const getChange = (updaters: iUpdaters, procedures: iProcedures): eTriggerChange | undefined => {
  const oldTriggers = updaters.old.length + (procedures.old?.procedure ? 1 : 0);
  const newTriggers = updaters.new.length + (procedures.new?.procedure ? 1 : 0);

  if (oldTriggers > 0 && newTriggers === 0) return 'DELETED';
  if (oldTriggers === 0 && newTriggers > 0) return 'CREATED';

  if (updaters.new.length !== updaters.old.length) return 'UPDATED';
  if (!deepEqual(procedures?.new, procedures?.old)) return 'UPDATED';

  const keys = Array.from(new Set([...updaters.old.map(({ key }) => key), ...updaters.new.map(({ key }) => key)]));
  if (
    keys.some((key) => {
      const oldUpdater = updaters.old.find((u) => u.key === key);
      const newUpdater = updaters.new.find((u) => u.key === key);
      return !deepEqual(oldUpdater?.updater, newUpdater?.updater);
    })
  )
    return 'UPDATED';

  return undefined;
};

/**
 * Get updater for a column
 * @param column
 * @param kind
 * @returns
 */
const getUpdater = (column: tRegularColumn, kind: eTriggerType) => {
  if (kind === 'INSERT') return column.onInsert;
  if (kind === 'UPDATE') return column.onUpdate;
  if (kind === 'DELETE') return column.onDelete;
  return undefined;
};

/**
 * Get updaters for a table
 * @param table
 * @param kind
 * @returns
 */
export const getUpdaters = (table: iTableEntity, kind: eTriggerType) => {
  const cols = Object.entries(table.columns);
  const updaters = cols.map(([key, col]) => ({ key, updater: getUpdater(col as tRegularColumn, kind) }));

  return updaters.filter((u) => !!u.updater);
};

/**
 * Get procedure for a table and a trigger kind
 * @param table
 * @param kind
 * @returns
 */
export const getProcedure = (table: iTableEntity, kind: eTriggerType) => {
  if (kind === 'INSERT') return table.beforeInsert;
  if (kind === 'UPDATE') return table.beforeUpdate;
  if (kind === 'DELETE') return table.beforeDelete;
  return undefined;
};

/**
 * Get trigger changes for a table and a snapshot
 * @param oldTable
 * @param newTable
 * @returns
 */
export const getTriggerChanges = (oldTable: iTableEntity, newTable: iTableEntity): Partial<iTriggerChanges> => {
  const state: iTriggerChanges = {
    insert: getChange(
      {
        old: getUpdaters(oldTable, 'INSERT'),
        new: getUpdaters(newTable, 'INSERT'),
      },
      { old: oldTable.beforeInsert, new: newTable.beforeInsert },
    ),
    update: getChange(
      {
        old: getUpdaters(oldTable, 'UPDATE'),
        new: getUpdaters(newTable, 'UPDATE'),
      },
      { old: oldTable.beforeUpdate, new: newTable.beforeUpdate },
    ),
    delete: getChange(
      {
        old: getUpdaters(oldTable, 'DELETE'),
        new: getUpdaters(newTable, 'DELETE'),
      },
      { old: oldTable.beforeDelete, new: newTable.beforeDelete },
    ),
  };

  return state;
};
