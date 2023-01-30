import * as chalk from 'chalk';
import { debug } from '../core/log';
import { createPostgresConnection, QueryFunction } from '../drivers/pg';
import { loadEntities } from '../entities/load';
import { iMigration, iVerboseConfig } from '../types';
import { saveTypes } from '../typing';
import { initMigrationExecution } from './init';
import { getAvailableMigrations } from './migrations';

// todo: add error if there are more migration in the database than locally available
// todo: support multiple schemas

/**
 * Run all available migrations
 * @param options orm config
 */
export const runMutations = async (options: iVerboseConfig) => {
  const migrationsTable = options.migrationsTable || '__migrations__';
  const schema = 'public';
  debug(chalk.dim(`Running migrations using table: ${migrationsTable}...`));

  // Creating SQL handler
  debug(chalk.dim(`Establishing connection to database...`));
  const { query, close } = createPostgresConnection(options);

  try {
    await initMigrationExecution(migrationsTable, schema, query, options);

    debug(chalk.dim(`Loading migrations...`));
    const migrations = await getAvailableMigrations(query, options, { schema, migrationsTable });
    if (migrations.length < 1) throw new Error('NO_NEW_MIGRATIONS');

    await executeMigrations({ migrations, query, schema, migrationsTable });

    if (options.typesDirectory) {
      const entities = await loadEntities(options.entitiesDirectory);
      await saveTypes(entities, options);
    }

    debug(chalk.dim('Migrations commited...'));
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
  migrationsTable,
}: {
  migrations: iMigration[];
  schema: string;
  migrationsTable: string;
  query: QueryFunction;
}) => {
  for (const migration of migrations) {
    debug(chalk.dim('> Generating propagated queries...'));
    const allQueries = await migration.up({ schema, query });
    const queries = Array.isArray(allQueries) ? allQueries : [allQueries];

    try {
      debug(chalk.dim(`> Executing migration: ${migration.id}...`));
      for (const sql of queries) await query(sql);

      debug(chalk.dim('> Updating migrations table...'));
      await query(`INSERT INTO "${schema}"."${migrationsTable}" (id) VALUES ($1)`, [migration.id]);
    } catch (error) {
      debug(chalk.dim('> Migration failed, reverting...'));

      const allQueries = await migration.down({ schema, query });
      const queries = Array.isArray(allQueries) ? allQueries : [allQueries];
      for (const sql of queries) {
        try {
          await query(sql);
        } catch (error) {
          debug(chalk.dim(`Failed to revert query: ${sql}`));
        }
      }
      // todo: revert migrations on fail

      throw error;
    }
  }
};
