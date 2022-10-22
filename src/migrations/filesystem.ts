import { existsSync, mkdirSync, pathExistsSync, readdir, writeFile } from 'fs-extra';
import { join } from 'path';
import { iMigration } from '../types';

/**
 * Save migration to the file system
 * @param id id of the migration
 * @param content content of the migration
 * @param migrationDirectory directory to be saved to
 */
export const saveMigration = async (id: string, content: string, migrationDirectory: string) => {
  const base = join(process.cwd(), migrationDirectory);
  const fileName = join(base, `${Math.round(Date.now() / 1000)}-${id}.migration.ts`);
  if (!pathExistsSync(base)) mkdirSync(base);
  if (existsSync(fileName)) throw new Error('Snapshot already exists with the same ID');

  await writeFile(fileName, content, { encoding: 'utf-8' });
};

/**
 * Load all the migrations from the defined directory
 * @param directory directory containing all the migrations
 * @returns migration list
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
