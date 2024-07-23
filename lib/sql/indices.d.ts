import { iIndex, iTableEntity } from '../types';
/**
 * Create index based on configuration on table
 * @param table name of the target table
 * @param index index configuration
 * @returns SQL query
 */
export declare const createIndex: (table: string, index: iIndex) => string[];
/**
 * Create DROP INDEX query
 * @param table name of the parent table
 * @param name name of the index
 * @param unique wether the index was unique
 * @returns SQL query
 */
export declare const dropIndex: (table: string, name: string, unique: boolean) => string[];
export declare const createIndicesForTable: (table: iTableEntity) => string[][];
