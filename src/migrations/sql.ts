import { iChanges, iTableChanges } from '../types/changes';
import { iRegularColumnOptions, iTableEntity, iTables, tColumn, tEntity, tRegularColumn } from '../types/entity';

export const generateQueries = (changes: iChanges, tables: iTables) => {
  const transactions: string[] = [];
  console.log(JSON.stringify(changes, null, 2));
  console.log(JSON.stringify(tables, null, 2));

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

  Object.keys(changes.added).map((key) => {
    transactions.push();
  });
  Object.keys(changes.dropped).map((key) => {
    transactions.push(`DROP COLUMN "${key}"`);
  });

  return formatSql(`
    ALTER TABLE "__SCHEMA__"."${table.name}"
    ${transactions}
    ;
  `);
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
    default: typeof column.default === 'function' ? column.default() : column.default,
  };
};

const createColumn = (column: tColumn, key: string): string => {
  if (['COMPUTED', 'RESOLVEd'].includes(column.kind)) return '';

  column = column as tRegularColumn;

  const options = getColumnOptions(column);
  // todo: update column based on types

  const constraints: string[] = [];
  if (!options.nullable) constraints.push('NOT NULL');
  if (options.unique) constraints.push('UNIQUE');
  if (options.primary) constraints.push('PRIMARY KEY');
  if (options.default) constraints.push(`DEFAULT ${options.default}`);

  // todo: support arrays

  return `${key} ${column.type} ${constraints.join(' ')}`.trim();
};

const formatSql = (sql: string) => {
  return sql.replace(/\n/g, '').replace(/\s\s+/g, ' ');
};
