import {
  BinaryTypes,
  BooleanTypes,
  DateTypes,
  eAllTypes,
  IntervalTypes,
  NumberTypes,
  StringTypes,
  UUIDTypes,
  EnumTypes,
} from '../types/datatypes';

/**
 * Get typescript equivalent of the postgres type
 * @param type postgres type
 * @returns typesript type string
 */
export const getType = (type: eAllTypes, values?: string[], array: boolean = false): string => {
  const arrayString = array ? '[]' : '';
  if ([...StringTypes, ...UUIDTypes].includes(type as any)) return `string${arrayString}`;
  if ([...NumberTypes, ...BinaryTypes, ...IntervalTypes].includes(type as any)) return `number${arrayString}`;
  if (DateTypes.includes(type as any)) return `Date${arrayString}`;
  if (BooleanTypes.includes(type as any)) return `boolean${arrayString}`;
  if (EnumTypes.includes(type as any)) return values.map((v) => `'${v}'`).join(' | ');
  return 'unknown';
};
