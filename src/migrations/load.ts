import { readdir } from 'fs-extra';
import { join } from 'path';
import { iMigration } from '../types';

/**
 * Load all the migrations from the defined directory
 * @param directory directory containing all the migrations
 * @returns
 */
export const loadMigrations = async (directory: string) => {
  try {
    const path = join(process.cwd(), directory);
    const content = await readdir(path);

    const files = content.filter((file) => file.endsWith('.migration.ts')).sort();

    // todo: handle malformed files
    const migrations = await Promise.all(
      files.map(async (file) => {
        const migrationPath = join(path, file);
        const module = await import(migrationPath).catch(() => null);

        if (!module) return;

        return module.default ?? module[Object.keys(module)[0]];
      }),
    );

    const validMigrations: iMigration[] = migrations.filter(Boolean);

    return validMigrations.map((M) => new (M as any)());
  } catch (error) {
    return [];
  }
};
