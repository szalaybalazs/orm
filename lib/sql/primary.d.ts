import { iTableChanges, iTableEntity } from '../types';
/**
 * Get primary keys of table
 * @param table table configuration
 * @returns SQL formatted column list
 */
export declare const getPrimaryKeys: (table: iTableEntity) => string[];
/**
 * Generated primary change queries
 * @param changes
 * @param state
 * @param snapshot
 * @returns
 */
export declare const changePrimaries: (changes: iTableChanges, state: iTableEntity, snapshot: iTableEntity) => [string[], string[]];
/**
 * Add primaries to table
 * @param state table configuration
 * @returns SQL Query or null
 */
export declare const createPrimaries: (state: iTableEntity) => string | null;
/**
 * Drop primaries from table
 * @param table name of target table
 * @returns SQL Query
 */
export declare const dropPrimaries: (table: string) => string;
