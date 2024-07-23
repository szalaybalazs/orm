import { iTableChanges, iTableEntity } from '../types';
/**
 * Create table creation query
 * @param table table configuration
 * @returns SQL Query
 */
export declare const createTable: (table: iTableEntity) => Promise<string[]>;
/**
 * Generate changes inside a single table
 * @param changes changes in the table
 * @param state current schema
 * @param snapshot previous table schema
 * @returns
 */
export declare const updateTable: (changes: iTableChanges, state: iTableEntity, snapshot: iTableEntity) => Promise<[string[], string[]]>;
/**
 * Drop table from database
 * @param name name of the table
 * @returns SQL Query
 */
export declare const dropTable: (name: string) => string;
