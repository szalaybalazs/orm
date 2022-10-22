import { iViewEntity } from '../types/entity';

export const createView = (view: iViewEntity): string => {
  const columns = Object.keys(view.columns).map((c) => `"${c}"`);
  const isRecursive = view.recursive || view.resolver.includes('__NAME__');
  const isMaterialized = view.materialized;

  const name = view.name;
  const query = view.resolver.replace(/__NAME__/g, name);

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
