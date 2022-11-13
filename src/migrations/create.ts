import { iVerboseConfig } from '../types';
import { saveMigration } from './filesystem';
import { getMigrationTemplate } from './template';

/**
 * Create an empty migration to be manually filled up
 * @param id id of the migration
 * @param name name of the migration
 * @param options configuration
 */
export const createEmptyMigration = async (id: string, name: string, options: iVerboseConfig) => {
  const migration = getMigrationTemplate(id, name, [], []);
  return saveMigration(id, migration, options.migrationsDirectory);
};
