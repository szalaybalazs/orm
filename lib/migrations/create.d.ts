import { iVerboseConfig } from '../types';
/**
 * Create an empty migration to be manually filled up
 * @param id id of the migration
 * @param name name of the migration
 * @param options configuration
 */
export declare const createEmptyMigration: (id: string, name: string, options: iVerboseConfig) => Promise<string>;
