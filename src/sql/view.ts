import { iViewEntity } from '../types/entity';

export const createView = (view: iViewEntity): string => {
  const columns = Object.keys(view.columns).map((c) => `"${c}"`);
  const isRecursive = view.recursive || view.resolver.includes('__NAME__');

  const name = view.name;
  const query = view.resolver.replace(/__NAME__/g, name);

  return `
    CREATE OR REPLACE ${isRecursive ? 'RECURSIVE' : ''} 
    VIEW "__SCHEMA__"."${name}" (${columns}) AS (${query});
  `;
};

export const dropView = (name: string): string => {
  return `DROP VIEW IF EXISTS "__SCHEMA__"."${name}" CASCADE;`;
};
