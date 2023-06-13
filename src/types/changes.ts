import { iForeignDefinition, iUpdaterFunction, tColumn } from './column';
import { iIndex } from './entity';
import { iExtensionChanges } from './extension';
import { iCustomType, iDependency } from './types';

export interface iChange {
  key: string;
  from?: string | number | boolean | undefined;
  to?: string | number | boolean | undefined;
}

export interface iChangeEntry {
  [key: string]: iChange[];
}

export interface iIndexChange {
  dropped: iIndex[];
  updated: { from: iIndex; to: iIndex }[];
  created: iIndex[];
}

export interface iCommentChanges {
  [key: string]: {
    from: string;
    to: string;
  };
}

export interface iForeignChanges {
  added: iForeignDefinition[];
  dropped: iForeignDefinition[];
}

export interface iTableChanges {
  kind?: 'TABLE';
  changes?: iChangeEntry;
  dropped?: string[];
  added?: { [key: string]: tColumn };
  indices?: Partial<iIndexChange>;
  comments?: iCommentChanges;
  foreign?: iForeignChanges;
  triggers?: Partial<iTriggerChanges>;
}

export interface iViewChanges {
  kind: 'VIEW';
  /**
   * Whether view should be dropped and recreated
   *
   * Only needed if column types change - by default query will use CREATE OR REPLACE
   */
  replace: { up: boolean; down: boolean };
  resolver?: { from: string; to: string };
  columns?: { from: string[]; to: string[] };
  materialized?: { from: boolean; to: boolean };
}

export interface iViewUpdate {
  key: string;
  kind: 'VIEW';
  changes: iViewChanges;
}
export interface iTableUpdate {
  key: string;
  kind: 'TABLE';
  changes: iTableChanges;
}
export interface iFunctionUpdate {
  key: string;
  kind: 'FUNCTION';
}

export type eUpdate = iViewUpdate | iTableUpdate | iFunctionUpdate;

export interface iTypeChange {
  name: string;
  dependencies: iDependency[];
  added: string[];
  removed: string[];
  new: iCustomType;
  old: iCustomType;
}

export interface iTypeChanges {
  created: iCustomType[];
  deleted: iCustomType[];
  updated: iTypeChange[];
}

export interface iTriggerChange extends iUpdaterFunction<any> {
  key: string;
}

export interface iTriggerUpdate {
  key: string;
  from: iTriggerChange;
  to: iTriggerChange;
}

export interface iProcedureChange {
  from: { procedure?: string };
  to: { procedure?: string };
}
export interface iTriggerChanges {
  created: iTriggerChange[];
  deleted: iTriggerChange[];
  updated: iTriggerUpdate[];
  change: 'UPDATE' | 'DELETE' | 'CREATE';
  beforeUpdate?: iProcedureChange;
}

export interface iChanges {
  deleted: string[];
  created: string[];
  updated: eUpdate[];
  extensions?: iExtensionChanges;
  types?: iTypeChanges;
  triggers?: iTriggerChanges;
}
