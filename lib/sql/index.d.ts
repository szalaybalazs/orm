import { iChanges, iTables } from '../types';
/**
 * Generate schema changing SQL queries
 * @param changes changes between the two schemas
 * @param state current table definition
 * @param snapshot previous definitions
 * @returns schema changes
 */
export declare const generateQueries: (changes: iChanges, state: iTables, snapshot: iTables) => Promise<{
    up: string[];
    down: string[];
}>;
