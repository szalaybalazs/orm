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

/**
 * Generate schema changing SQL queries
 * @param changes changes between the two schemas
 * @param state current table definition
 * @param snapshot previous definitions
 * @returns schema changes
 */
export const generateQueries = (
  changes: iChanges,
  state: iTables,
  snapshot: iTables,
): { up: string[]; down: string[] } => {
  const up: string[] = [];
  const down: string[] = [];

  // Handle removes
  changes.deleted.forEach((key) => {
    // Drop table from current schema
    up.push(`DROP TABLE IF EXISTS "__SCHEMA__"."${key}" CASCADE;`);

    // Create table based on previous snapshot
    const table = snapshot[key];
    if (table.type !== 'VIEW') down.push(createTable(table as iTableEntity));
  });

  // Handle creates
  changes.created.forEach((key) => {
    // Create table based on current schema
    const table = state[key];
    if (table.type !== 'VIEW') up.push(createTable(table as iTableEntity));

    // Destroying table when reverted
    down.push(`DROP TABLE IF EXISTS "__SCHEMA__"."${key}" CASCADE;`);
  });

  // Handle updates
  changes.updated.forEach((change) => {
    const [transactionUp, transactionDown] = updateTable(change.changes, state[change.key], snapshot[change.key]);

    // Commit changes to tables
    if (transactionUp) up.push(transactionUp);

    // Revert changes
    if (transactionDown) down.push(transactionDown);
  });

  return { up, down };
};

/**
 * Generate changes inside a single table
 * @param changes changes in the table
 * @param state current schema
 * @param snapshot previous table schema
 * @returns
 */
const updateTable = (changes: iTableChanges, state: tEntity, snapshot: tEntity): [string, string] => {
  const up: string[] = [];
  const down: string[] = [];
  if (state.type === 'VIEW') return ['', ''];

  Object.keys(changes.added).forEach((key) => {
    up.push(`ADD COLUMN ${createColumn(state.columns[key], key)}`);
    down.push(`DROP COLUMN "${key}"`);
  });

  changes.dropped.forEach((key) => {
    // Drop column
    up.push(`DROP COLUMN "${key}"`);

    // Add column when reverting
    if (snapshot.type !== 'VIEW') {
      down.push(`ADD COLUMN ${createColumn(snapshot.columns[key], key)}`);
    }
  });

  Object.keys(changes.changes).map((key) => {
    changes.changes[key].forEach((change) => {
      up.push(`ALTER COLUMN "${key}" ${getChangeKey(change.key, change.to)}`);
      down.push(`ALTER COLUMN "${key}" ${getChangeKey(change.key, change.from)}`);
    });
  });

  const upSql = formatSql(`ALTER TABLE "__SCHEMA__"."${state.name}" ${up};`);
  const downSql = formatSql(`ALTER TABLE "__SCHEMA__"."${state.name}" ${down};`);

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
