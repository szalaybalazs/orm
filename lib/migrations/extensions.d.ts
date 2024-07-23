import { QueryFunction } from '../drivers/pg';
import { iTables } from '../types';
/**
 * Generate extension creation queries
 * @param state current schema state
 * @param query Query function
 */
export declare const createExtensions: (state: iTables, query: QueryFunction) => Promise<void>;
/**
 * Generate extension creation queries
 * @param state current schema state
 * @returns queries
 */
export declare const createExtensionQueries: (state: iTables) => string[];
