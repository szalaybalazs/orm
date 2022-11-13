import { chalk } from '../core/chalk';
import { debug } from '../core/log';
import { QueryFunction } from '../drivers/pg';
import { iVerboseConfig } from '../types';

/**
 * Create the mutation table before
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

export const initMigrationExecution = async (
  migrationsTable: string,
  schema: string,
  query: QueryFunction,
  options: iVerboseConfig,
) => {
  debug(chalk.dim(`> Making sure schema exists...`));
  await query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

  debug(chalk.dim(`> Creating migrations table...`));
  await createMutationsTable(migrationsTable, query, schema);
};
