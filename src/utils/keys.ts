import { convertKey } from '../core/naming';
import { tEntity } from '../types';
import { eNamingConvention } from '../types/config';

/**
 * Get the name of the columns
 * @param entity
 * @param naming
 * @returns
 */
export const getEntitiyKeys = (entity: tEntity): string[] => {
  if (entity.type === 'FUNCTION') return [];
  const columns = Object.keys(entity.columns);

  return columns.map((key) => convertKey(key, 'SNAKE'));
};
