import { ensureDirSync, existsSync, mkdirSync, pathExistsSync, readdir, writeFile } from 'fs-extra';
import { join } from 'path';
import { chalk } from '../core/chalk';
import { debug } from '../core/log';
import { iMigration } from '../types';

/**
 * Save migration to the file system
 * @param id id of the migration
 * @param content content of the migration
 * @param migrationDirectory directory to be saved to
 */
export const saveMigration = async (id: string, content: string, migrationDirectory: string) => {
  const migrations = await loadMigrations(migrationDirectory);

  const base = migrationDirectory;
  const fileName = join(base, `${Math.round(Date.now() / 1000)}-${id}.migration.ts`);

  ensureDirSync(base);

  if (existsSync(fileName) || migrations.find((m) => m.id === id)) throw new Error('EXISTS');

  await writeFile(fileName, content, { encoding: 'utf-8' });

  return fileName;
};

/**
 * Load all the migrations from the defined directory
 * @param directory directory containing all the migrations
 * @returns migration list
 */
export const loadMigrations = async (directory: string) => {
  try {
    debug(chalk.dim(`> Loading migrations from ${directory}`));
    const content = await readdir(directory);
    
    const files = content.filter((file) => file.endsWith('.migration.ts')).sort();
    debug(chalk.dim(`> Migrations loaded from ${directory}:`), files);
    // todo: handle malformed files
    const migrations = await Promise.all(
      files.map(async (file) => {
        const migrationPath = join(directory, file);
        const module = await import(migrationPath).catch((error: any) => {
          debug(chalk.red('[ERROR]'), chalk.dim(`Failed to load migration ${migrationPath}`), error.message);
          return null;
        });
        debug(migrationPath, module);

        if (!module) return;

        return module.default ?? module[Object.keys(module)[0]];
      }),
    );

    const validMigrations: iMigration[] = migrations.filter(Boolean);

    return validMigrations.map((M) => new (M as any)());
  } catch (error) {
    debug(chalk.red('[ERROR]'), chalk.dim(error));
    return [];
  }
};
