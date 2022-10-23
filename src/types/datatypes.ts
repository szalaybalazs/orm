// hstore, , , , enum, point, line, lseg, box, path, polygon, circle, cidr, inet, macaddr, tsvector, tsquery, uuid, xml, json, jsonb, int4range, int8range, numrange, tsrange, tstzrange, daterange, geometry, geography, cube, ltree

export const NumberTypes = [
  'int',
  'int2',
  'int4',
  'int8',
  'smallint',
  'integer',
  'bigint',
  'decimal',
  'numeric',
  'real',
  'double',
  'smallserial',
  'serial',
  'bigseria',
] as const;
// export type eNumberType = typeof NumberTypes[number];
export type eNumberType =
  | 'int'
  | 'int2'
  | 'int4'
  | 'int8'
  | 'smallint'
  | 'integer'
  | 'bigint'
  | 'decimal'
  | 'numeric'
  | 'real'
  | 'double'
  | 'smallserial'
  | 'serial'
  | 'bigseria';

export const StringTypes = ['character varying', 'varchar', 'character', 'char', 'text', 'citext'] as const;
export type eStringType = 'character varying' | 'varchar' | 'character' | 'char' | 'text' | 'citext';

export const DateTypes = [
  'timetz',
  'timestamptz',
  'timestamp',
  'timestamp without time zone',
  'timestamp with time zone',
  'date',
  'time',
  'time without time zone',
  'time with time zone',
];
export type eDateTypes =
  | 'timetz'
  | 'timestamptz'
  | 'timestamp'
  | 'timestamp without time zone'
  | 'timestamp with time zone'
  | 'date'
  | 'time'
  | 'time without time zone'
  | 'time with time zone';

export const UUIDTypes = ['uuid'] as const;
export type eUUIDType = 'uuid';

export const IntervalTypes = ['interval'] as const;
export type eIntervalType = 'interval';

export const BinaryTypes = ['bytea', 'bit', 'varbit', 'bit varying'];
export type eBinaryType = 'bytea' | 'bit' | 'varbit' | 'bit varying';

export const BooleanTypes = ['bool', 'boolean'];
export type eBooleanType = 'bool' | 'boolean';

export type eAllTypes = eNumberType | eStringType | eUUIDType | eDateTypes | eBooleanType | eBinaryType | eIntervalType;

export type DefaultFunction<T> = (() => Promise<T>) | (() => T);
