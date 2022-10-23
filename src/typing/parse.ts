import {
  BinaryTypes,
  BooleanTypes,
  DateTypes,
  eAllTypes,
  IntervalTypes,
  NumberTypes,
  StringTypes,
  UUIDTypes,
} from '../types/datatypes';

/**
 * Get typescript equivalent of the postgres type
 * @param type postgres type
 * @returns typesript type string
 */
export const getType = (type: eAllTypes): string => {
  if ([...StringTypes, ...UUIDTypes].includes(type as any)) return 'string';
  if ([...NumberTypes, ...BinaryTypes, ...IntervalTypes].includes(type as any)) return 'number';
  if (DateTypes.includes(type as any)) return 'Date';
  if (BooleanTypes.includes(type as any)) return 'boolean';
  return 'unknown';
};
