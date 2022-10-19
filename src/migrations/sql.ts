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

export const generateQueries = (changes: iChanges, tables: iTables) => {
  const transactions: string[] = [];

  // Handle removes
  changes.deleted.forEach((key) => {
    transactions.push(`DROP TABLE IF EXISTS "__SCHEMA__"."${key}" CASCADE;`);
  });

  // Handle creates
  changes.created.forEach((key) => {
    const table = tables[key];
    if (table.type !== 'VIEW') transactions.push(createTable(tables[key] as iTableEntity));
  });

  // Handle updates
  changes.updated.forEach((change) => {
    const transaction = updateTable(tables[change.key], change.changes);
    if (transaction) transactions.push(transaction);
  });

  return transactions.map((t) => t.trim());
};

const updateTable = (table: tEntity, changes: iTableChanges): string => {
  const transactions: string[] = [];
  if (table.type === 'VIEW') return '';

  Object.keys(changes.added).forEach((key) => {
    transactions.push(`ADD COLUMN ${createColumn(table.columns[key], key)}`);
  });
  changes.dropped.forEach((key) => {
    transactions.push(`DROP COLUMN "${key}"`);
  });
  Object.keys(changes.changes).map((key) => {
    changes.changes[key].forEach((change) => {
      const changeSql = getChangeKey(change.key, change.to);
      transactions.push(`ALTER COLUMN "${key}" ${changeSql}`);
    });
  });

  return formatSql(`
    ALTER TABLE "__SCHEMA__"."${table.name}"
    ${transactions}
    ;
  `);
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
