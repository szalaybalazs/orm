import { debug } from '../core/log';
import { createPostgresConnection, QueryFunction } from '../drivers/pg';
import { iOrmConfig, iVerboseConfig } from '../types/config';
import * as chalk from 'chalk';
import { loadMigrations } from './load';
import { iMigration } from '../types/migration';
import { finished } from 'stream';

// todo: support multiple schemas
export const runMutations = async (options: iVerboseConfig) => {
  const migrationsTable = options.migrationsTable || '__migrations__';
  const schema = 'public';
  debug(options.verbose, chalk.gray(`Running migrations using table: ${migrationsTable}...`));

  // Creating SQL handler
  debug(options.verbose, chalk.gray(`Establishing connection to database...`));
  const { query, close } = createPostgresConnection(options);

  try {
    // create mutations table if nothing exists
    debug(options.verbose, chalk.gray(`Creating migrations table...`));
    await createMutationsTable(migrationsTable, query, schema);

    // query mutations

    debug(options.verbose, chalk.gray(`Loading last migration...`));
    const lastMigration = await getLastMigrationId(migrationsTable, query, schema);

    debug(options.verbose, chalk.gray(`Loaded last migration: ${lastMigration}`));
    debug(options.verbose, chalk.gray(`Loading migrations...`));

    const allMigrations: iMigration[] = await loadMigrations(options.migrations);

    const lastMigrationIndex = allMigrations.findIndex((m) => m.id === lastMigration);

    const migrations = allMigrations.slice(lastMigrationIndex + 1, allMigrations.length);

    if (migrations.length < 1) throw new Error('NO_NEW_MIGRATIONS');

    for (const migration of migrations) {
      console.log(migration);
      // todo: handle revert queries
      const allQueries = await migration.up({ schema, query });
      const queries = Array.isArray(allQueries) ? allQueries : [allQueries];

      console.log(queries);

      debug(options.verbose, chalk.gray(`Executing migration: ${migration.id}...`));
      await Promise.all(queries.map((sql) => query(sql)));
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

export const getLastMigrationId = async (
  name: string,
  query: QueryFunction,
  schema: string = 'PUBLIC',
): Promise<string | null> => {
  const migrations = await query(
    `SELECT id, index, commited_at FROM "${schema}"."${name}" ORDER BY commited_at, index DESC LIMIT 1`,
  );

  return migrations?.[0]?.id ?? null;
};
