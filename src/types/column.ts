import {
  DefaultFunction,
  eAllTypes,
  eBinaryType,
  eBooleanType,
  eDateTypes,
  eEnumType,
  eIntervalType,
  eJSONTypes,
  eNumberType,
  eStringType,
  eUUIDType,
} from './datatypes';

export type eForeignDelete = 'NULL' | 'DEFAULT' | 'RESTRICT' | 'SKIP' | 'CASCADE';
export interface iForeignReference {
  table: string;
  column: string;
  onDelete?: eForeignDelete;
}

export interface iForeignDefinition extends iForeignReference {
  source: string;
  name: string;
}

export interface iUpdaterFunction<T> {
  set?: T;
}
export type eTriggerType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface iBaseColumnOptions<T = undefined> {
  name?: string;

  primary?: boolean;

  comment?: string;

  reference?: iForeignReference;

  // Triggers
  onInsert?: T;
  onUpdate?: T;
  onDelete?: T;
}

export interface iRegularColumnOptions<T = undefined> extends iBaseColumnOptions<iUpdaterFunction<T>> {
  kind?: 'REGULAR';

  unique?: boolean;
  nullable?: boolean;

  array?: boolean;
}

type tNumberDefault = number | DefaultFunction<number>;
export interface iNumberColumn extends iRegularColumnOptions<tNumberDefault> {
  type: eNumberType;
  default?: tNumberDefault;

  // todo: handle
  precision?: number;
}

type eDateDefaults = 'CURRENT_TIMESTAMP' | 'NOW()' | 'now()' | 'now' | 'today' | 'tomorrow' | 'yesterday';
type tDateDefault = eDateDefaults | Date | DefaultFunction<eDateDefaults | Date>;
export interface iDateColumn extends iRegularColumnOptions<tDateDefault> {
  type: eDateTypes;
  default?: tDateDefault;

  // todo: handle
  precision?: number;
}

type tStringDefault = string | DefaultFunction<string>;
export interface iStringColumn extends iRegularColumnOptions<tStringDefault> {
  type: eStringType;
  default?: tStringDefault;
}

export interface iBinaryColumn extends iRegularColumnOptions<tStringDefault> {
  type: eBinaryType;
  default?: tStringDefault;
}
export interface iIntervalColumn extends iRegularColumnOptions<tStringDefault> {
  type: eIntervalType;
  default?: tStringDefault;
}

type tBooleanDefault = boolean | DefaultFunction<boolean>;
export interface iBooleanColumn extends iRegularColumnOptions<tBooleanDefault> {
  type: eBooleanType;
  default?: tBooleanDefault;
}

export interface iUUIDColumn extends iBaseColumnOptions {
  kind?: 'REGULAR';
  type: eUUIDType;
  generated?: boolean;
  nullable?: boolean;
  array?: boolean;
  default?: tStringDefault;
}

export interface iEnumColumn extends iBaseColumnOptions {
  enumName?: string;
  kind?: 'REGULAR';
  type: eEnumType;
  default?: string;
  enum: string[];
  nullable?: boolean;
}
export interface iJSONColumn extends iBaseColumnOptions {
  kind?: 'REGULAR';
  type: eJSONTypes;
  default?: string | any;
  nullable?: boolean;
}

export type tRegularColumn =
  | iNumberColumn
  | iStringColumn
  | iUUIDColumn
  | iDateColumn
  | iBinaryColumn
  | iIntervalColumn
  | iBooleanColumn
  | iEnumColumn
  | iJSONColumn;

export interface iComputedColumn {
  kind: 'COMPUTED';
  resolver: string;
  type: eAllTypes;
  comment?: string;
}

export interface iResolvedColumn {
  kind: 'RESOLVED';
  resolver: string;
  type: eAllTypes;
  comment?: string;
}

export type eColumnKeys =
  | keyof iNumberColumn
  | keyof iStringColumn
  | keyof iUUIDColumn
  | keyof iDateColumn
  | keyof iBinaryColumn
  | keyof iIntervalColumn
  | keyof iBooleanColumn;

export type tColumn = tRegularColumn | iComputedColumn | iResolvedColumn;
