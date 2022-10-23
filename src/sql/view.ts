import { getQuery } from '../core/commands';
import { getViewResolver } from '../helpers/view';
import { iViewEntity } from '../types';

// todo: create view column rename logic

/**
 * Create new view
 * @param view view config
 * @returns SQL Query
 */
export const createView = (view: iViewEntity): string => {
  const name = view.name;
  const columns = Object.keys(view.columns).map((c) => `"${c}"`);
  const { query, isRecursive } = getViewResolver(name, view.resolver);
  const isMaterialized = view.materialized;

  return getQuery(
    'CREATE',
    !isMaterialized && 'OR REPLACE',
    isMaterialized && 'MATERIALIZED',
    isRecursive && 'RECURSIVE',
    'VIEW',
    `"__SCHEMA__"."${name}"`,
    `(${columns})`,
    'AS',
    `(${query})`,
  );
};

/**
 * Drop existing view by config
 * @param view view config
 * @returns SQL Query
 */
export const dropView = (view: iViewEntity): string => {
  return getQuery(
    'DROP',
    view.materialized && 'MATERIALIZED',
    'VIEW',
    'IF EXISTS',
    `"__SCHEMA__"."${view.name}"`,
    'CASCADE',
  );
};
