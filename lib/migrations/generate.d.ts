import { iVerboseConfig } from '../types';
/**
 * Generate new migration
 * @param id id of the migration
 * @param name name of the migrations
 * @param options configuration
 */
export declare const generateMigration: (id: string, name: string, options: iVerboseConfig) => Promise<string | void>;
