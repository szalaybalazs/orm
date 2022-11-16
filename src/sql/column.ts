import { eAllTypes, eColumnKeys, iChange, iRegularColumnOptions, iUUIDColumn, tColumn, tRegularColumn } from '../types';
import { getDefault } from './defaults';

/**
 * Create column query
 * @param table name of table
 * @param key key of column
 * @param column column config
 * @returns SQL Query
 */
export const createColumn = async (table: string, key: string, column: tColumn): Promise<string> => {
  if (column.kind === 'COMPUTED') {
    return `"${key}" ${getTypeForColumn(table, key, column)}${(column as any).array ? '[]' : ''} GENERATED ALWAYS AS (${
      column.resolver
    }) STORED`.trim();
  } else if (column.kind === 'RESOLVED') return '';
  else {
    const options = await getColumnOptions(column);
    // todo: update column based on types

    const constraints: string[] = [];
    if (!options.nullable) constraints.push(getConstraint('REQUIRED'));
    if (options.default) constraints.push(getConstraint('DEFAULT', options.default));

    // todo: support arrays

    return `"${key}" ${getTypeForColumn(table, key, column)} ${constraints.join(' ')}`.trim();
  }
};

/**
 * Get initial SQL options for columns
 * @param column column configuration
 * @returns config
 */
const getColumnOptions = async (column: tColumn): Promise<Partial<iRegularColumnOptions & { default: any }>> => {
  const options = {};

  if (column.kind === 'COMPUTED') return options;
  if (column.kind === 'RESOLVED') return options;

  if (column.type === 'uuid') {
    return {
      default: (column as iUUIDColumn).generated ? 'uuid_generate_v4()' : undefined,
      primary: column.primary,
      nullable: column.nullable,
    };
  }

  return {
    ...column,
    default: await getDefault(column),
  };
};

const getConstraint = (key: 'REQUIRED' | 'UNIQUE' | 'PRIMARY' | 'DEFAULT', value: string = '') => {
  if (key === 'REQUIRED') return 'NOT NULL';
  if (key === 'UNIQUE') return 'UNIQUE';
  if (key === 'DEFAULT') return `DEFAULT ${value}`;
};

/**
 * Generate change query for column change
 * @param key key of the column
 * @param column column configuration
 * @param change changes in the column
 * @returns Up and Down SQL Queries
 */
export const changeColumn = async (
  key: string,
  column: tRegularColumn,
  change: iChange,
): Promise<{ up: string; down: string }> => {
  let up: string = '';
  let down: string = '';
  // if (change.key === 'primary') return;
  // tableUp.push();
  // tableDown.push(`ALTER COLUMN "${key}" ${getChangeKey(change.key, change.from)}`);
  up = await getChangeQueryByKey(key, column, change.key, change.to);
  down = await getChangeQueryByKey(key, column, change.key, change.from);

  return { up, down };
};

/**
 * Get change for column
 * @param key key of column
 * @param column column configuration
 * @param changeKey key of the change
 * @param to new value of the option
 * @returns SQL Query
 */
const getChangeQueryByKey = async (
  key: string,
  column: tRegularColumn,
  changeKey: string,
  to: any,
): Promise<string> => {
  const query = await getChange(column, changeKey as eColumnKeys, to);
  if (query) return `ALTER COLUMN "${key}" ${query}`;
  return '';
};

/**
 * Get actual changing SQL for column
 * @param column column definition
 * @param key key of the change
 * @param to new value
 * @returns SQL Query
 */
const getChange = async (column: tRegularColumn, key: eColumnKeys, to: any): Promise<string | null> => {
  if (key === 'default' || key === 'generated') {
    if ([undefined, null, void 0].includes(to)) return `DROP DEFAULT`;
    return `SET DEFAULT ${await getDefault({ ...column, default: to } as any)}`;
  }
  if (key === 'nullable') return `${to ? 'SET' : 'DROP'} NOT NULL`;
  // todo: handle precision
  if (key === 'precision') return ``;
};

const getTypeForColumn = (table: string, name: string, column: tColumn): eAllTypes | string => {
  if (column.type === 'enum') return (column as any).enumName || `${table}_${name}_enum`.replace(/-/g, '_');

  return column.type;
};
