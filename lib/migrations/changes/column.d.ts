import { iChange, tColumn } from '../../types';
/**
 * List all the changes for columns
 * @param oldColumn old column definition
 * @param newColumn new column definition
 * @returns changes
 */
export declare const getChangesForColumn: (oldColumn: tColumn, newColumn: tColumn) => iChange[];
