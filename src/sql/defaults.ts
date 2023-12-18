import { tColumn } from '../types';
import { getTypeForColumn } from './column';

/**
 * Generate the default value of the column, based on config
 * @param column sql compatible default
 * @returns
 */
export const getDefault = async (table: string, column: tColumn): Promise<string | null> => {
  if (column.kind === 'COMPUTED') return null;
  if (column.kind === 'RESOLVED') return null;

  if (column.type === 'uuid' && column.generated) return `uuid_generate_v4()`;

  const value = typeof column.default === 'function' ? await column.default() : column.default;
  const type = typeof value;
  const pgType = getTypeForColumn(table, column.name, column);

  const custom = customResolver(String(value));
  if (custom) return custom;

  if (value instanceof Date) return `'${value.toISOString()}'`;

  if (type === 'string') return `'${String(value).replace(/'/g, '')}'::${pgType}`;
  if (type === 'number') return `${Number(value)}::${pgType}`;
  if (type === 'boolean') {
    return `${String(Boolean(value)).toUpperCase()}::${pgType}`;
  }

  return null;
};

/**
 * Generate resolvers for custom default types
 * @param value input value
 * @returns custom value or null
 */
export const customResolver = (value: string): string | null => {
  if (value === 'CURRENT_TIMESTAMP') return 'CURRENT_TIMESTAMP';
  if (['now', 'NOW()'].includes(value)) return 'NOW()';
  if (['today'].includes(value)) return `CURRENT_DATE`;
  if (['tomorrow'].includes(value)) return `CURRENT_DATE + INTERVAL '1 day'`;
  if (['yesterday'].includes(value)) return `CURRENT_DATE + INTERVAL '1 day'`;

  return null;
};
