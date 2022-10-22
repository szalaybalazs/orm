import { format } from 'sql-formatter';
import { iViewChanges } from '../../types/changes';
import { iViewEntity } from '../../types/entity';

// todo: load columns from resolver & throw error if columns not match the set columns

export const getChangesForViews = (key: string, oldView: iViewEntity, newView: iViewEntity): iViewChanges => {
  const changes: iViewChanges = {
    kind: 'VIEW',
    replace: { up: false, down: false },
  };

  const oldQuery = format(oldView.resolver);
  const newQuery = format(newView.resolver);

  if (oldQuery !== newQuery) {
    changes.resolver = {
      from: oldQuery,
      to: newQuery,
    };
  }

  if (oldView.materialized !== newView.materialized) {
    changes.materialized = {
      from: oldView.materialized,
      to: newView.materialized,
    };
  }

  const oldColumns = Object.keys(oldView.columns);
  const newColumns = Object.keys(newView.columns);

  const columnsAdded = newColumns.some((col) => !oldColumns.includes(col));
  const columnsRemoved = oldColumns.some((col) => !newColumns.includes(col));

  const difference = getDifference(oldColumns, newColumns);
  const intersection = oldColumns.filter((col) => newColumns.includes(col));

  if (difference.length > 0) {
    changes.columns = {
      from: oldColumns,
      to: newColumns,
    };
  }

  const isEitherMaterialized = oldView.materialized || newView.materialized;
  const isTypeChanged = intersection.reduce((prev, col) => {
    if (prev) return true;
    const oldType = oldView.columns[col];
    const newType = newView.columns[col];

    return oldType !== newType;
  }, false);

  const isReplaceNeeded = isEitherMaterialized || isTypeChanged;

  const replace = {
    up: isReplaceNeeded || columnsRemoved,
    down: isReplaceNeeded || columnsAdded,
  };

  return { ...changes, replace };
};

const getDifference = (arr1: string[], arr2: string[]) => {
  return arr1.filter((x) => !arr2.includes(x)).concat(arr2.filter((x) => !arr1.includes(x)));
};
