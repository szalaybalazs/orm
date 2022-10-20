import { iIndex, tColumn } from './entity';

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
  changes: iChangeEntry;
  dropped: string[];
  added: { [key: string]: tColumn };
  indices: Partial<iIndexChange>;
}

export interface iChanges {
  deleted: string[];
  created: string[];
  updated: {
    key: string;
    changes: iTableChanges;
  }[];
}
