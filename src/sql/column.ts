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
    const options = await getColumnOptions(table, column);
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
 * @param table name of the table
 * @param column column configuration
 * @returns config
 */
const getColumnOptions = async (
  table: string,
  column: tColumn,
): Promise<Partial<iRegularColumnOptions & { default: any }>> => {
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
    default: await getDefault(table, column),
  };
};

const getConstraint = (key: 'REQUIRED' | 'UNIQUE' | 'PRIMARY' | 'DEFAULT', value: string = '') => {
  if (key === 'REQUIRED') return 'NOT NULL';
  if (key === 'UNIQUE') return 'UNIQUE';
  if (key === 'DEFAULT') return `DEFAULT ${value}`;
};

/**
 * Generate change query for column change
 * @param table name of the table
 * @param key key of the column
 * @param column column configuration
 * @param change changes in the column
 * @returns Up and Down SQL Queries
 */
export const changeColumn = async (
  table: string,
  key: string,
  column: tRegularColumn,
  prevColumn: tRegularColumn,
  change: iChange,
): Promise<{ up: string[]; down: string[] }> => {
  let up: string[] = [];
  let down: string[] = [];
  // if (change.key === 'primary') return;
  // tableUp.push();
  // tableDown.push(`ALTER COLUMN "${key}" ${getChangeKey(change.key, change.from)}`);

  up.push(await getChangeQueryByKey(table, key, column, change.key, change.to));
  down.push(await getChangeQueryByKey(table, key, column, change.key, change.from));

  // if (['type', 'array'].includes(change.key)) {
  //   const columnOptions = await getColumnOptions(table, column);
  //   const prevColumnOptions = await getColumnOptions(table, prevColumn);

  //   if (prevColumnOptions.default) up.unshift(await getChangeQueryByKey(column.name, table, column, 'default', null));
  //   if (columnOptions.default) {
  //     up.push(await getChangeQueryByKey(table, column.name, column, 'default', columnOptions.default));
  //   }

  //   if (columnOptions.default) down.unshift(await getChangeQueryByKey(table, column.name, column, 'default', null));
  //   if (prevColumnOptions.default) {
  //     down.push(await getChangeQueryByKey(table, column.name, column, 'default', columnOptions.default));
  //   }
  // }

  // todo: solve type update logic
  return { up, down };
};

/**
 * Get change for column
 * @param table name of the table
 * @param key key of column
 * @param column column configuration
 * @param changeKey key of the change
 * @param to new value of the option
 * @returns SQL Query
 */
const getChangeQueryByKey = async (
  table: string,
  key: string,
  column: tRegularColumn,
  changeKey: string,
  to: any,
): Promise<string> => {
  const query = await getChange(table, column, changeKey as eColumnKeys, to);
  if (query) return `ALTER COLUMN "${key}" ${query}`;
  return '';
};

/**
 * Get actual changing SQL for column
 * @param table table name
 * @param column column definition
 * @param key key of the change
 * @param to new value
 * @returns SQL Query
 */
export const getChange = async (
  table: string,
  column: tRegularColumn,
  key: eColumnKeys,
  to: any,
): Promise<string | null> => {
  if (key === 'default' || key === 'generated') {
    if ([undefined, null, void 0].includes(to)) return `DROP DEFAULT`;
    return `SET DEFAULT ${await getDefault(table, { ...column, default: to } as any)}`;
  }
  if (key === 'nullable') return `${to ? 'SET' : 'DROP'} NOT NULL`;
  if (key === 'array' || key === 'type') {
    // todo: handle default update
    const type = getTypeForColumn(table, column.name, { ...column, [key]: to });
    const using = `USING ARRAY["${column.name}"]::${getTypeForColumn(table, column.name, { ...column, [key]: to })}`;

    return `TYPE ${type} ${key === 'array' && to ? using : ''}`;
  }
  // todo: handle precision
  if (key === 'precision') return ``;
};

/**
 * Get type defition for columns
 * @param table name of the table
 * @param name name of the column
 * @param column column defitionion
 * @returns
 */
export const getTypeForColumn = (table: string, name: string, column: tColumn): eAllTypes | string => {
  if (column.type === 'enum') return (column as any).enumName || `${table}_${name}_enum`.replace(/-/g, '_');

  return `${column.type}${(column as any).array ? '[]' : ''}`;
};
