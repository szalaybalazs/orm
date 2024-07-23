import { QueryFunction } from '../drivers/pg';
import { iVerboseConfig } from '../types';
/**
 * Create the mutation table before
 * @param name name of the table
 * @param query query function
 * @param schema name of the function - fallbacks to PUBLIC
 * @returns
 */
export declare const createMutationsTable: (name: string, query: QueryFunction, schema?: string) => Promise<any[]>;
export declare const initMigrationExecution: (migrationsTable: string, schema: string, query: QueryFunction, options: iVerboseConfig) => Promise<void>;
