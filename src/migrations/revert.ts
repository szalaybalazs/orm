import * as chalk from 'chalk';
import cliSelect from 'cli-select';
import { debug } from '../core/log';
import { createPostgresConnection } from '../drivers/pg';
import { iVerboseConfig } from '../types/config';
import { iMigration } from '../types/migration';
import { loadMigrations } from './load';
import { getExecutedMigrations } from './run';

export const revertMigrations = async (options: iVerboseConfig) => {
  const migrationsTable = options.migrationsTable || '__migrations__';
  const schema = 'public';

  const { query, close } = createPostgresConnection(options);
  try {
    debug(options.verbose, chalk.gray('Creating database connection...'));

    debug(options.verbose, chalk.gray('Loading local & remote migrations...'));
    const [localMigrations, executedMigrations]: [iMigration[], { id: string }[]] = await Promise.all([
      loadMigrations(options.migrations),
      getExecutedMigrations(migrationsTable, query, schema),
    ]);

    const values = executedMigrations.reduce(
      (acc, { id }) => ({ ...acc, [id]: localMigrations.find((m) => m.id === id)?.name }),
      {},
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

    const index = executedMigrations.findIndex((m) => m.id === migration.id);
    const revertedMigrations = executedMigrations.slice(0, index);

    console.log(revertedMigrations);

    for (const executedMigration of revertedMigrations) {
      const migration = localMigrations.find((m) => m.id === executedMigration.id);
      const queries = await migration.down({ schema, query });

      for (const sql of queries) {
        await query(sql);
      }
    }

    await query(`DELETE FROM "${migrationsTable}" WHERE id IN (${revertedMigrations.map(({ id }) => `'${id}'`)})`);
  } catch (error) {
    throw error;
  } finally {
    close();
  }
};
