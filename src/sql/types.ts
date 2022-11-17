import { iTables } from '../types';
import { iCustomType, iDependency } from '../types/types';
import { getChange } from './column';
import { getDefault } from './defaults';

const normalizeName = (name: string) => {
  return name.replace(/-/g, '_');
};

export const createType = (name: string, values: string[]): string => {
  return `CREATE TYPE "__SCHEMA__"."${normalizeName(name)}" AS ENUM (${values.map(
    (v) => `'${v.replace(/'/g, '')}'`,
  )});`;
};

export const dropType = (name: string): string => {
  return `DROP TYPE IF EXISTS "__SCHEMA__"."${normalizeName(name)}";`;
};

export const addValue = (name: string, value: string): string => {
  return `ALTER TYPE "__SCHEMA__"."${normalizeName(name)}" ADD VALUE IF NOT EXISTS '${value}';`;
};

export const removeValue = async (
  type: iCustomType,
  dependencies: iDependency[],
  state: iTables,
): Promise<string[]> => {
  const sql: string[] = [];

  // 0. generate sql compatible name
  const key = normalizeName(type.name);

  // 1. rename old type to type_old
  sql.push(`ALTER TYPE "__SCHEMA__"."${key}" RENAME TO "${key}_old";`);

  // 2. create new type
  sql.push(createType(type.name, type.values));

  // 3. drop default values for columns using the type
  dependencies.forEach(({ table, columns }) => {
    const alters = columns.map((column) => {
      return `ALTER COLUMN "${column}" DROP DEFAULT`;
    });

    sql.push(`
      ALTER TABLE "__SCHEMA__"."${table}" ${alters}
    `);
  });

  // 4. change all columns to the new type
  dependencies.forEach(({ table, columns }) => {
    const alters = columns.map((column) => {
      return `ALTER COLUMN "${column}" TYPE "__SCHEMA__"."${key}" USING "${column}"::"text"::"__SCHEMA__"."${key}"`;
    });

    sql.push(`
      ALTER TABLE "__SCHEMA__"."${table}" ${alters}
    `);
  });

  // 5. set default values for columns
  for (const { table, columns } of dependencies) {
    // Only regular tables can be updated
    const entity = state[table];
    if (entity.type === 'FUNCTION' || entity.type === 'VIEW') continue;

    // Get the default values of the columns
    const columnsWithDefaultsPromise = columns.map(async (c) => {
      const column = entity.columns[c];
      if (column.kind === 'COMPUTED' || column.kind === 'RESOLVED') return { column: c };
      if (column.type === 'uuid') return { column: c };

      return { column: c, default: await getDefault(column) };
    });

    const columnsWithDefaults = await Promise.all(columnsWithDefaultsPromise);

    // Only set default value for columns with actual values
    const alteredColumns = columnsWithDefaults.filter((c) => !!c.default);

    // Generate alter statements
    const alters = alteredColumns.map((column) => {
      return `ALTER COLUMN "${column.column}" SET DEFAULT ${column.default}`;
    });

    sql.push(`
      ALTER TABLE "__SCHEMA__"."${table}" ${alters}
    `);
  }

  // 6. drop _old type
  sql.push(`DROP TYPE IF EXISTS "__SCHEMA__"."${key}_old"`);

  return sql;
};
