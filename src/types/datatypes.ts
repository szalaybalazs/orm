// hstore, , , , enum, point, line, lseg, box, path, polygon, circle, cidr, inet, macaddr, tsvector, tsquery, uuid, xml, json, jsonb, int4range, int8range, numrange, tsrange, tstzrange, daterange, geometry, geography, cube, ltree

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

export type eStringType = 'character varying' | 'varchar' | 'character' | 'char' | 'text' | 'citext';

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

export type eUUIDType = 'uuid';

export type eIntervalType = 'interval';

export type eBinaryType = 'bytea' | 'bit' | 'varbit' | 'bit varying';

export type eBooleanType = 'bool' | 'boolean';

export type eAllTypes = eNumberType | eStringType | eUUIDType | eDateTypes;

export type DefaultFunction<T> = (() => Promise<T>) | (() => T);
