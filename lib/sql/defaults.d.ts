import { tColumn } from '../types';
/**
 * Generate the default value of the column, based on config
 * @param column sql compatible default
 * @returns
 */
export declare const getDefault: (table: string, column: tColumn) => Promise<string | null>;
/**
 * Generate resolvers for custom default types
 * @param value input value
 * @returns custom value or null
 */
export declare const customResolver: (value: string) => string | null;
