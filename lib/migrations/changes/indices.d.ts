import { iIndex, iIndexChange } from '../../types';
export declare const getIndexChanges: (table: string, oldIndices: iIndex[], newIndices: iIndex[]) => iIndexChange;
export declare const getIndexName: (table: string, index: iIndex) => string;
