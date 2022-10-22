import { getViewResolver } from '../helpers/view';
import { iViewEntity } from '../types/entity';

// todo: support functional resolver
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

const getQuery = (...commands: (string | undefined | boolean | null)[]) => {
  return commands.filter(Boolean).join(' ');
};
