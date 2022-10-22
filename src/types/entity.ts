// hstore, bytea, bit, varbit, bit varying, interval, bool, boolean, enum, point, line, lseg, box, path, polygon, circle, cidr, inet, macaddr, tsvector, tsquery, uuid, xml, json, jsonb, int4range, int8range, numrange, tsrange, tstzrange, daterange, geometry, geography, cube, ltree

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

export type allTypes = eNumberType | eStringType | eUUIDType | eDateTypes;

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

  // todo: handle
  precision?: number;
}

type eDateDefaults = 'CURRENT_TIMESTAMP' | 'NOW()' | 'now' | 'today' | 'tomorrow' | 'yesterday';

export interface iDateColumn extends iRegularColumnOptions {
  type: eDateTypes;
  default?: eDateDefaults | Date | DefaultFunction<eDateDefaults | Date>;

  // todo: handle
  precision?: number;
}

export interface iStringColumn extends iRegularColumnOptions {
  type: eStringType;
  default?: string | DefaultFunction<string>;
}

export interface iUUIDColumn extends iBaseColumnOptions {
  kind?: 'REGULAR';
  type: eUUIDType;
  generated?: boolean;
  nullable?: boolean;
}

export type tRegularColumn = iNumberColumn | iStringColumn | iUUIDColumn | iDateColumn;
export type tColumn = tRegularColumn | iComputedColumn | iResolvedColumn;

export interface iIndex {
  // By default uses the standard naming convention
  // https://gist.github.com/popravich/d6816ef1653329fb1745
  name?: string;

  unique?: boolean;
  method?: 'btree' | 'hash' | 'gist' | 'spgist' | 'gin' | 'brin';

  columns: (string | { column: string; order?: 'ASC' | 'DESC'; nulls?: 'FIRST' | 'LAST' })[];
  includes?: (string | { column: string })[];
}

export interface iTableEntity {
  type?: 'TABLE';
  name: string;
  columns: Record<string, tColumn>;
  indices?: iIndex[];
}

export interface iViewEntity {
  type: 'VIEW';
  name: string;
  resolver: string | ((name: string) => string);

  recursive?: boolean;
  materialized?: boolean;

  // Column definitions are required to detect return type changes
  // Views can not be replaced if a column type has changed
  columns: {
    [key: string]: allTypes;
  };
}

export type tEntity = iTableEntity | iViewEntity;

export interface iTables extends Record<string, tEntity> {}

export interface iSnapshot {
  tables: iTables;
  id: string;
  timestamp: Date;
}
