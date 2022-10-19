import { iChanges, iTableChanges } from '../types/changes';
import {
  DefaultFunction,
  iRegularColumnOptions,
  iTableEntity,
  iTables,
  tColumn,
  tEntity,
  tRegularColumn,
} from '../types/entity';

export const generateQueries = (changes: iChanges, tables: iTables): { up: string[]; down: string[] } => {
  const up: string[] = [];
  const down: string[] = [];

  // Handle removes
  changes.deleted.forEach((key) => {
    up.push(`DROP TABLE IF EXISTS "__SCHEMA__"."${key}" CASCADE;`);

    // todo: create table when reverted
    // needs previous tables
  });

  // Handle creates
  changes.created.forEach((key) => {
    const table = tables[key];
    if (table.type !== 'VIEW') up.push(createTable(tables[key] as iTableEntity));

    // Destroying table when reverted
    down.push(`DROP TABLE IF EXISTS "__SCHEMA__"."${key}" CASCADE;`);
  });

  // Handle updates
  changes.updated.forEach((change) => {
    const [transactionUp, transactionDown] = updateTable(tables[change.key], change.changes);
    if (transactionUp) up.push(transactionUp);
    if (transactionDown) down.push(transactionDown);
  });

  return { up, down };
};

const updateTable = (table: tEntity, changes: iTableChanges): [string, string] => {
  const up: string[] = [];
  const down: string[] = [];
  if (table.type === 'VIEW') return ['', ''];

  Object.keys(changes.added).forEach((key) => {
    up.push(`ADD COLUMN ${createColumn(table.columns[key], key)}`);
    down.push(`DROP COLUMN "${key}"`);
  });
  changes.dropped.forEach((key) => {
    up.push(`DROP COLUMN "${key}"`);

    // todo: create column when reverted - NEEDS previews tables
    // up.push(`ADD COLUMN ${createColumn(table.columns[key], key)}`);
  });

  Object.keys(changes.changes).map((key) => {
    changes.changes[key].forEach((change) => {
      up.push(`ALTER COLUMN "${key}" ${getChangeKey(change.key, change.to)}`);
      down.push(`ALTER COLUMN "${key}" ${getChangeKey(change.key, change.from)}`);
    });
  });

  const upSql = formatSql(`ALTER TABLE "__SCHEMA__"."${table.name}" ${up};`);

  const downSql = formatSql(`ALTER TABLE "__SCHEMA__"."${table.name}" ${down};`);
  return [upSql, downSql];
};

// todo: handle other changes

const getChangeKey = (key: string, value: DefaultFunction<any> | any) => {
  if (key === 'unique') return `UNIQUE ${value}`;
  if (key === 'default') return `DEFAULT ${getDefault(value)}`;
};

const createTable = (table: iTableEntity): string => {
  const sql = `
    CREATE TABLE IF NOT EXISTS "__SCHEMA__"."${table.name}" (
      ${Object.keys(table.columns)
        .map((key) => createColumn(table.columns[key], key))
        .filter(Boolean)
        .join(', ')}
    );
  `;

  return formatSql(sql);
};

// todo: escale keywords
const getDefault = (val: DefaultFunction<string | number> | any) => {
  const value = typeof val === 'function' ? val() : val;
  return typeof value === 'string' ? `'${value}'` : value;
};

const getColumnOptions = (column: tColumn): Partial<iRegularColumnOptions & { default: any }> => {
  const options = {};

  if (column.kind === 'COMPUTED') return options;
  if (column.kind === 'RESOLVED') return options;

  if (column.type === 'uuid') {
    return {
      default: column.generated ? 'uuid_generate_v4()' : undefined,
      primary: column.primary,
    };
  }

  return {
    ...column,
    default: getDefault(column.default),
  };
};

const getConstraint = (key: 'REQUIRED' | 'UNIQUE' | 'PRIMARY' | 'DEFAULT', value: string = '') => {
  if (key === 'REQUIRED') return 'NOT NULL';
  if (key === 'UNIQUE') return 'UNIQUE';
  if (key === 'PRIMARY') return 'PRIMARY KEY';
  if (key === 'DEFAULT') return `DEFAULT ${value}`;
};

const createColumn = (column: tColumn, key: string): string => {
  if (['COMPUTED', 'RESOLVEd'].includes(column.kind)) return '';

  column = column as tRegularColumn;

  const options = getColumnOptions(column);
  // todo: update column based on types

  const constraints: string[] = [];
  if (!options.nullable) constraints.push(getConstraint('REQUIRED'));
  if (options.unique) constraints.push(getConstraint('UNIQUE'));
  if (options.primary) constraints.push(getConstraint('PRIMARY'));
  if (options.default) constraints.push(getConstraint('DEFAULT', options.default));

  // todo: support arrays

  return `"${key}" ${column.type} ${constraints.join(' ')}`.trim();
};

const formatSql = (sql: string) => {
  return sql.replace(/\n/g, '').replace(/\s\s+/g, ' ');
};

// todo: generate revert logic
