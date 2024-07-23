import { QueryFunction } from '../drivers/pg';
import { iMigration, iQueryOptions, iVerboseConfig } from '../types';
/**
 * Getting last migration from database, returns null if no prior migrations wre found
 * @param name name of the migrations table
 * @param query query runner
 * @param schema name of the schema (default: PUBLIC)
 * @returns id of the last migration or null
 */
export declare const getExecutedMigrationIds: (name: string, query: QueryFunction, schema?: string) => Promise<string[]>;
/**
 * Getting last migration from database, returns null if no prior migrations wre found
 * @param name name of the migrations table
 * @param query query runner
 * @param schema name of the schema (default: PUBLIC)
 * @returns id of the last migration or null
 */
export declare const getExecutedMigrations: (name: string, query: QueryFunction, schema?: string) => Promise<{
    id: string;
    commited_at: string;
}[]>;
/**
 * Get all available migrations, based on local version and snapshot
 * @param query query function
 * @param options orm options
 * @param queryOptions query options, specifying the schema and migrations table
 * @returns
 */
export declare const getAvailableMigrations: (query: QueryFunction, options: iVerboseConfig, { schema, migrationsTable }: iQueryOptions) => Promise<iMigration[]>;
