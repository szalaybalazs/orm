import { iFunctionEntity } from '../types/entity';

const append = (val: string | undefined, cond: boolean, prefix: string = '', suffix: string = ';') => {
  if (cond) return `${prefix} ${val}${suffix}`;
  return '';
};

export const createFunction = (entity: iFunctionEntity) => {
  const args = Object.entries(entity?.args ?? {}).map(([name, type]) => `${name} ${type}`);

  const declarations = Object.entries(entity.variables).map(([name, type]) => `${name} ${type};`);

  const sql = `
CREATE OR REPLACE FUNCTION ${entity.name}(${args}) 
  RETURNS ${entity.returns}
  LANGUAGE plpgsql
  ${append('IMMUTABLE', entity.immutable, '', '')}
  ${append('STABLE', entity.stable, '', '')}
  ${append('VOLATILE', entity.volatile, '', '')}
AS $$
  ${declarations.length > 0 ? 'DECLARE' : ''} ${declarations.join('\n')}
  BEGIN
  ${append(entity.body, !!entity.body)}
  ${append(entity.return, !!entity.return, 'RETURN')}
  END;
$$;
  `;

  return sql
    .trim()
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .join('\n');
};

export const dropFunction = (entity: iFunctionEntity) => {
  const sql = `DROP FUNCTION IF EXISTS ${entity.name} CASCADE;`;

  return sql;
};
