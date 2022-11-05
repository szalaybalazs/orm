import {
  DefaultFunction,
  eAllTypes,
  eBinaryType,
  eBooleanType,
  eDateTypes,
  eIntervalType,
  eNumberType,
  eStringType,
  eUUIDType,
} from './datatypes';

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

type eDateDefaults = 'CURRENT_TIMESTAMP' | 'NOW()' | 'now()' | 'now' | 'today' | 'tomorrow' | 'yesterday';

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
export interface iBinaryColumn extends iRegularColumnOptions {
  type: eBinaryType;
  default?: string | DefaultFunction<string>;
}
export interface iIntervalColumn extends iRegularColumnOptions {
  type: eIntervalType;
  default?: string | DefaultFunction<string>;
}
export interface iBooleanColumn extends iRegularColumnOptions {
  type: eBooleanType;
  default?: boolean | DefaultFunction<boolean>;
}

export interface iUUIDColumn extends iBaseColumnOptions {
  kind?: 'REGULAR';
  type: eUUIDType;
  generated?: boolean;
  nullable?: boolean;
}

export type tRegularColumn =
  | iNumberColumn
  | iStringColumn
  | iUUIDColumn
  | iDateColumn
  | iBinaryColumn
  | iIntervalColumn
  | iBooleanColumn;

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
