import { eAllTypes, eColumnKeys, iChange, iTableEntity, tColumn, tRegularColumn } from '../types';
/**
 * Create column query
 * @param table name of table
 * @param key key of column
 * @param column column config
 * @returns SQL Query
 */
export declare const createColumn: (table: string, key: string, column: tColumn) => Promise<string>;
/**
 * Generate change query for column change
 * @param table name of the table
 * @param key key of the column
 * @param column column configuration
 * @param change changes in the column
 * @returns Up and Down SQL Queries
 */
export declare const changeColumn: (table: string, key: string, column: tRegularColumn, prevColumn: tRegularColumn, change: iChange) => Promise<{
    tableUp: string[];
    tableDown: string[];
    up: string[];
    down: string[];
}>;
/**
 * Get actual changing SQL for column
 * @param table table name
 * @param column column definition
 * @param key key of the change
 * @param to new value
 * @returns SQL Query
 */
export declare const getChange: (table: string, column: tRegularColumn, key: eColumnKeys, to: any) => Promise<string | null>;
/**
 * Get type defition for columns
 * @param table name of the table
 * @param name name of the column
 * @param column column defitionion
 * @returns
 */
export declare const getTypeForColumn: (table: string, name: string, column: tColumn) => eAllTypes | string;
export declare const getTypeCompatibility: (from: tRegularColumn, to: tRegularColumn) => boolean;
/**
 * Get column extened by its name from the state
 * @param state current table state
 * @param key key of column
 * @returns column defition
 */
export declare const getColumn: (state: iTableEntity, key: string) => tColumn & {
    name: string;
};
