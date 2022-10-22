import { tColumn } from './column';
import { iIndex } from './entity';

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

export interface iTableChanges {
  kind?: 'TABLE';
  changes?: iChangeEntry;
  dropped?: string[];
  added?: { [key: string]: tColumn };
  indices?: Partial<iIndexChange>;
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
  kind?: 'TABLE';
  changes: iTableChanges;
}

export type eUpdate = iViewUpdate | iTableUpdate;

export interface iChanges {
  deleted: string[];
  created: string[];
  updated: eUpdate[];
}
