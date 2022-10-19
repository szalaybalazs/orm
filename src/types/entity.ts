// hstore, bytea, bit, varbit, bit varying, timetz, timestamptz, timestamp, timestamp without time zone, timestamp with time zone, date, time, time without time zone, time with time zone, interval, bool, boolean, enum, point, line, lseg, box, path, polygon, circle, cidr, inet, macaddr, tsvector, tsquery, uuid, xml, json, jsonb, int4range, int8range, numrange, tsrange, tstzrange, daterange, geometry, geography, cube, ltree

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

export type DefaultFunction<T> = (() => Promise<T>) | (() => T);

export interface iResolvedColumn {
  kind: 'RESOLVED';

  resolver: string;
}

export interface iComputedColumn {
  kind: 'COMPUTED';
}

export interface iBaseColumnOptions {
  name?: string;

  primary?: boolean;

  comment?: string;
}

export interface iRegularColumnOptions extends iBaseColumnOptions {
  kind?: 'REGULAR';

  unique?: boolean;
  nullable?: boolean;

  array?: boolean;
}

export interface iNumberColumn extends iRegularColumnOptions {
  type: eNumberType;
  default?: number | DefaultFunction<number>;
  precision?: number;
}

export interface iStringColumn extends iRegularColumnOptions {
  type: eStringType;
  default?: string | DefaultFunction<string>;
}

export interface iUUIDColumn extends iBaseColumnOptions {
  kind?: 'REGULAR';
  type: 'uuid';
  generated?: boolean;
}

export type tRegularColumn = iNumberColumn | iStringColumn | iUUIDColumn;
export type tColumn = tRegularColumn | iComputedColumn | iResolvedColumn;

export interface iTableEntity {
  type?: 'TABLE';
  name: string;
  columns: Record<string, tColumn>;
}

export interface iViewEntity {
  type: 'VIEW';
  name: 'string';
}

export type tEntity = iTableEntity | iViewEntity;

export interface iTables extends Record<string, tEntity> {}

export interface iSnapshot {
  tables: iTables;
  id: string;
  timestamp: Date;
}
