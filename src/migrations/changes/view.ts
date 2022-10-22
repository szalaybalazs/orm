import { format } from 'sql-formatter';
import { getViewResolver } from '../../helpers/view';
import { iViewChanges } from '../../types/changes';
import { iViewEntity } from '../../types/entity';

// todo: load columns from resolver & throw error if columns not match the set columns

/**
 * Get changes between previous and current view
 * Determine whether the old view should be dropped or replace is enough
 * @param oldView the old view config
 * @param newView the new view config
 * @returns changes between the views
 */
export const getChangesForViews = (oldView: iViewEntity, newView: iViewEntity): iViewChanges => {
  const changes: iViewChanges = {
    kind: 'VIEW',
    replace: { up: false, down: false },
  };

  const oldQuery = format(getViewResolver(oldView.name, oldView.resolver).query);
  const newQuery = format(getViewResolver(newView.name, newView.resolver).query);

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

  // The previous view should be dropped if:
  // - Any of the views are materialized views (mat. views can not be "replaced")
  // - Any of the column types changed
  // - Columns have been removed from the view (views can only be extended, not shrinked)
  //   Since when the column list changes there is both addition and substraction to the column list, the view will be either dropped in the "up" or "down" cycle

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
