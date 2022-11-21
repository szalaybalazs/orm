import * as chalk from 'chalk';
import cliSelect from 'cli-select';
import { broadcast, debug } from '../core/log';
import { createPostgresConnection, QueryFunction } from '../drivers/pg';
import { iMigration, iVerboseConfig } from '../types';
import { loadMigrations } from './filesystem';
import { getExecutedMigrations } from './migrations';

export const revertMigrations = async (options: iVerboseConfig) => {
  const migrationsTable = options.migrationsTable || '__migrations__';
  const schema = 'public';

  const { query, close } = createPostgresConnection(options);
  try {
    debug(options.verbose, chalk.dim('Creating database connection...'));

    debug(options.verbose, chalk.dim('Loading local & remote migrations...'));
    const [localMigrations, executedMigrations]: [iMigration[], { id: string }[]] = await Promise.all([
      loadMigrations(options.migrationsDirectory),
      getExecutedMigrations(migrationsTable, query, schema),
    ]);

    const values = executedMigrations.reduce(
      (acc, { id }) => ({ ...acc, [id]: localMigrations.find((m) => m.id === id)?.name }),
      {},
    );

    broadcast(
      chalk.cyan.yellow('❯'),
      chalk.reset('Select the migration to revert to:'),
      chalk.dim('(The selected migtion will be the last migration to keep)'),
    );
    const migration = await cliSelect({
      values,
      unselected: chalk.dim('○'),
      selected: chalk.cyan('⦿'),
      valueRenderer: (value: any, selected) => {
        if (selected) {
          return chalk.underline(value);
        }

        return value;
      },
    });

    if (!migration) return;

    debug(options.verbose, chalk.dim('Reverting to selected migration...'));

    const index = executedMigrations.findIndex((m) => m.id === migration.id);
    const revertedMigrations = executedMigrations.slice(0, index);

    await revertMigrationsById(
      revertedMigrations.map(({ id }) => id),
      migrationsTable,
      schema,
      query,
      options,
    );

    debug(options.verbose, chalk.dim('Revert finished...'));
  } catch (error) {
    throw error;
  } finally {
    close();
  }
};

export const revertMigrationsById = async (
  reverts: string[],
  table: string,
  schema: string,
  query: QueryFunction,
  options: iVerboseConfig,
) => {
  const migrations = await loadMigrations(options.migrationsDirectory);

  debug(options.verbose, chalk.dim('Reverting migration changes...'));
  for (const executedMigration of reverts) {
    const migration = migrations.find((m) => executedMigration === m.id);
    const queries = await migration.down({ schema, query });

    for (const sql of queries) {
      await query(sql);
    }
  }

  debug(options.verbose, chalk.dim('Removing migrations from migration table...'));
  await query(`DELETE FROM "${table}" WHERE id IN (${reverts.map((id) => `'${id}'`)})`);
};
