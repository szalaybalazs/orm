import * as chalk from 'chalk';
import { debug } from '../core/log';
import { createPostgresConnection, QueryFunction } from '../drivers/pg';
import { loadEntities } from '../entities/load';
import { iMigration, iVerboseConfig } from '../types';
import { saveTypes } from '../typing';
import { initMigrationExecution } from './init';
import { getAvailableMigrations } from './migrations';

// todo: support multiple schemas

/**
 * Run all available migrations
 * @param options orm config
 */
export const runMutations = async (options: iVerboseConfig) => {
  const migrationsTable = options.migrationsTable || '__migrations__';
  const schema = 'public';
  debug(options.verbose, chalk.gray(`Running migrations using table: ${migrationsTable}...`));

  // Creating SQL handler
  debug(options.verbose, chalk.gray(`Establishing connection to database...`));
  const { query, close } = createPostgresConnection(options);

  try {
    await initMigrationExecution(migrationsTable, schema, query, options);

    debug(options.verbose, chalk.gray(`Loading migrations...`));

    const migrations = await getAvailableMigrations(query, options, { schema, migrationsTable });
    if (migrations.length < 1) throw new Error('NO_NEW_MIGRATIONS');

    await executeMigrations({ migrations, query, schema, options, migrationsTable });

    if (options.typesDirectory) {
      const entities = await loadEntities(options.entitiesDirectory);
      await saveTypes(entities, options.typesDirectory);
    }

    debug(options.verbose, chalk.gray('Migrations commited...'));
  } catch (error) {
    throw error;
  } finally {
    // closing psql connection
    await close();
  }
};

export const executeMigrations = async ({
  migrations,
  schema,
  query,
  options,
  migrationsTable,
}: {
  migrations: iMigration[];
  schema: string;
  migrationsTable: string;
  query: QueryFunction;
  options: iVerboseConfig;
}) => {
  for (const migration of migrations) {
    // todo: handle revert queries
    const allQueries = await migration.up({ schema, query });
    const queries = Array.isArray(allQueries) ? allQueries : [allQueries];

    // todo: revert migrations on fail
    debug(options.verbose, chalk.gray(`Executing migration: ${migration.id}...`));
    for (const sql of queries) await query(sql);
  }

  debug(options.verbose, chalk.gray('Updating migrations table...'));

  const sql = `INSERT INTO "${schema}"."${migrationsTable}" (id) VALUES ${migrations.map(
    (migration) => `('${migration.id}')`,
  )}`;
  await query(sql);
};
