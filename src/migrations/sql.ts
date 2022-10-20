import { iChanges, iTableChanges } from '../types/changes';
import {
  DefaultFunction,
  iIndex,
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
    const [transactionsUp, transactionsDown] = updateTable(change.changes, state[change.key], snapshot[change.key]);

    // Commit changes to tables
    if (transactionsUp) up.push(...transactionsUp);

    // Revert changes
    if (transactionsDown) down.push(...transactionsDown);
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
const updateTable = (changes: iTableChanges, state: tEntity, snapshot: tEntity): [string[], string[]] => {
  const up: string[] = [];
  const down: string[] = [];

  const tableUp: string[] = [];
  const tableDown: string[] = [];

  const indicesUp: string[] = [];
  const indicesDown: string[] = [];

  if (state.type === 'VIEW') return [[], []];

  Object.keys(changes.added).forEach((key) => {
    tableUp.push(`ADD COLUMN ${createColumn(state.columns[key], key)}`);
    tableDown.push(`DROP COLUMN "${key}"`);
  });

  changes.dropped.forEach((key) => {
    // Drop column
    tableUp.push(`DROP COLUMN "${key}"`);

    // Add column when reverting
    if (snapshot.type !== 'VIEW') {
      tableDown.push(`ADD COLUMN ${createColumn(snapshot.columns[key], key)}`);
    }
  });

  Object.keys(changes.changes).map((key) => {
    changes.changes[key].forEach((change) => {
      tableUp.push(`ALTER COLUMN "${key}" ${getChangeKey(change.key, change.to)}`);
      tableDown.push(`ALTER COLUMN "${key}" ${getChangeKey(change.key, change.from)}`);
    });
  });

  if (tableUp.length) up.push(formatSql(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableUp};`));
  if (tableDown.length) down.push(formatSql(`ALTER TABLE "__SCHEMA__"."${state.name}" ${tableDown};`));

  changes.indices.dropped.forEach((index) => {
    up.push(`DROP INDEX IF EXISTS "__SCHEMA__"."${index.name}" CASCADE`);

    down.push(createIndex(state.name, index));
  });

  changes.indices.updated.forEach((index) => {
    up.push(`DROP INDEX IF EXISTS "__SCHEMA__"."${index.from.name}" CASCADE`);
    up.push(createIndex(state.name, index.to));

    down.push(`DROP INDEX IF EXISTS "__SCHEMA__"."${index.to.name}" CASCADE`);
    down.push(createIndex(state.name, index.from));
  });

  changes.indices.created.forEach((index) => {
    up.push(createIndex(state.name, index));

    down.push(`DROP INDEX IF EXISTS "__SCHEMA__"."${index.name}" CASCADE`);
  });

  return [[...up].filter(Boolean), [...down].filter(Boolean)];
};

const createIndex = (table: string, index: iIndex): string => {
  const columns = index.columns.map((column) => {
    if (typeof column === 'string') return `"${column}"`;

    return `"${column.column}" ${column.order ?? ''} ${column.nulls ? `NULLS ${column.nulls}` : ''}`.trim();
  });

  const method = index.method ? `USING ${index.method}` : '';
  const include = index.includes?.length ? `INCLUDE (${index.includes})` : '';

  return `
    CREATE ${index.unique ? 'UNIQUE' : ''} INDEX 
    "${index.name}" ON "__SCHEMA__"."${table}" ${method}
    (${columns}) ${include}
  `;
};

// todo: handle other changes
const getChangeKey = (key: string, value: DefaultFunction<any> | any) => {
  if (key === 'unique') return `UNIQUE ${value}`;
  if (key === 'nullable') return `${!value ? '' : 'DROP '}NOT NULL`;
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

// todo: handle multiple foreign keys
