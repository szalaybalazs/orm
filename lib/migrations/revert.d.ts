import { QueryFunction } from '../drivers/pg';
import { iVerboseConfig } from '../types';
export declare const revertMigrations: (options: iVerboseConfig) => Promise<void>;
export declare const revertMigrationsById: (reverts: string[], table: string, schema: string, query: QueryFunction, options: iVerboseConfig) => Promise<void>;
