/**
 * Save migration to the file system
 * @param id id of the migration
 * @param content content of the migration
 * @param migrationDirectory directory to be saved to
 */
export declare const saveMigration: (id: string, content: string, migrationDirectory: string) => Promise<string>;
export declare const importModule: (path: string) => Promise<any>;
/**
 * Load all the migrations from the defined directory
 * @param directory directory containing all the migrations
 * @returns migration list
 */
export declare const loadMigrations: (directory: string) => Promise<any[]>;
