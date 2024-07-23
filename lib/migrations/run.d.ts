import { QueryFunction } from '../drivers/pg';
import { iMigration, iVerboseConfig } from '../types';
/**
 * Run all available migrations
 * @param options orm config
 */
export declare const runMutations: (options: iVerboseConfig) => Promise<void>;
export declare const executeMigrations: ({ migrations, schema, query, migrationsTable, options, }: {
    migrations: iMigration[];
    schema: string;
    migrationsTable: string;
    query: QueryFunction;
    options: iVerboseConfig;
}) => Promise<void>;
