import { QueryFunction } from '../drivers/pg';
import { iMigration, iQueryOptions, iVerboseConfig } from '../types';
import { loadMigrations } from './filesystem';

/**
 * Getting last migration from database, returns null if no prior migrations wre found
 * @param name name of the migrations table
 * @param query query runner
 * @param schema name of the schema (default: PUBLIC)
 * @returns id of the last migration or null
 */
export const getLastMigrationId = async (
  name: string,
  query: QueryFunction,
  schema: string = 'PUBLIC',
): Promise<string | null> => {
  const sql = `SELECT id, index, commited_at FROM "${schema}"."${name}" ORDER BY commited_at DESC, index DESC LIMIT 1`;

  const migrations = await query(sql);

  return migrations?.[0]?.id ?? null;
};

/**
 * Getting last migration from database, returns null if no prior migrations wre found
 * @param name name of the migrations table
 * @param query query runner
 * @param schema name of the schema (default: PUBLIC)
 * @returns id of the last migration or null
 */
export const getExecutedMigrations = async (
  name: string,
  query: QueryFunction,
  schema: string = 'PUBLIC',
): Promise<{ id: string; commited_at: string }[]> => {
  const sql = `SELECT id, index, commited_at FROM "${schema}"."${name}" ORDER BY commited_at DESC, index DESC`;

  return query(sql);
};

/**
 * Get all available migrations, based on local version and snapshot
 * @param query query function
 * @param options orm options
 * @param queryOptions query options, specifying the schema and migrations table
 * @returns
 */
export const getAvailableMigrations = async (
  query: QueryFunction,
  options: iVerboseConfig,
  { schema, migrationsTable }: iQueryOptions,
): Promise<iMigration[]> => {
  const loadPromise = await Promise.all([
    loadMigrations(options.migrationsDirectory),
    getLastMigrationId(migrationsTable, query, schema),
  ]);

  const [allMigrations, lastMigration]: [iMigration[], string | null] = loadPromise;

  const lastMigrationIndex = allMigrations.findIndex((m) => m.id === lastMigration);

  const migrations = allMigrations.slice(lastMigrationIndex + 1, allMigrations.length);

  return migrations;
};
