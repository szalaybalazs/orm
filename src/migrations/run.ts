import * as chalk from 'chalk';
import { debug } from '../core/log';
import { createPostgresConnection, QueryFunction } from '../drivers/pg';
import { loadLastSnapshot } from '../snapshots';
import { iVerboseConfig } from '../types/config';
import { iSnapshot } from '../types/entity';
import { iMigration } from '../types/migration';
import { createExtensions } from './extensions';
import { loadMigrations } from './load';

// todo: support multiple schemas

/**
 * Run all available migrations
 * @param options orm config
 */
export const runMutations = async (options: iVerboseConfig) => {
  const migrationsTable = options.migrationsTable || '__migrations__';
  const schema = 'public';
  debug(options.verbose, chalk.gray(`Running migrations using table: ${migrationsTable}...`));

  // todo: get last snapshot

  // Creating SQL handler
  debug(options.verbose, chalk.gray(`Establishing connection to database...`));
  const { query, close } = createPostgresConnection(options);

  try {
    debug(options.verbose, chalk.gray(`Making sure schema exists...`));
    await query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

    debug(options.verbose, chalk.gray(`Creating migrations table...`));
    await createMutationsTable(migrationsTable, query, schema);

    debug(options.verbose, chalk.gray(`Loading migrations...`));
    const [allMigrations, lastMigration, lastSnapshot]: [iMigration[], string | null, iSnapshot | null] =
      await Promise.all([
        loadMigrations(options.migrations),
        getLastMigrationId(migrationsTable, query, schema),
        loadLastSnapshot(options.snapshots),
      ]);
    debug(options.verbose, chalk.gray(`Loaded last migration: ${lastMigration}`));

    if (lastSnapshot) {
      debug(options.verbose, chalk.gray(`Creating necesarry extensions...`));
      await createExtensions(lastSnapshot?.tables, query);
    }

    const lastMigrationIndex = allMigrations.findIndex((m) => m.id === lastMigration);

    const migrations = allMigrations.slice(lastMigrationIndex + 1, allMigrations.length);

    if (migrations.length < 1) throw new Error('NO_NEW_MIGRATIONS');

    for (const migration of migrations) {
      // todo: handle revert queries
      const allQueries = await migration.up({ schema, query });
      const queries = Array.isArray(allQueries) ? allQueries : [allQueries];

      debug(options.verbose, chalk.gray(`Executing migration: ${migration.id}...`));
      for (const sql of queries) {
        await query(sql);
      }
    }

    debug(options.verbose, chalk.gray('Updating migrations table...'));

    const sql = `INSERT INTO "${schema}"."${migrationsTable}" (id) VALUES ${migrations.map(
      (migration) => `('${migration.id}')`,
    )}`;
    await query(sql);
    debug(options.verbose, chalk.gray('Migrations commited...'));
  } catch (error) {
    throw error;
  } finally {
    // closing psql connection
    await close();
  }
};

/**
 * Create the mutation table
 * @param name name of the table
 * @param query query function
 * @param schema name of the function - fallbacks to PUBLIC
 * @returns
 */
export const createMutationsTable = (name: string, query: QueryFunction, schema: string = 'PUBLIC') => {
  const sql = `
    CREATE TABLE IF NOT EXISTS "${schema}"."${name}" (
      index SERIAL PRIMARY KEY NOT NULL,
      id VARCHAR NOT NULL UNIQUE,
      commited_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  return query(sql);
};

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
  const migrations = await query(
    `SELECT id, index, commited_at FROM "${schema}"."${name}" ORDER BY commited_at DESC, index DESC LIMIT 1`,
  );

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
