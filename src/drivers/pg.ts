import { Pool } from 'pg';
import { highlight } from 'sql-highlight';
import { chalk } from '../core/chalk';
import { broadcast, debug } from '../core/log';
import { iPostgresConfig } from '../types';

export type QueryFunction = (sql: string, variables?: any[]) => Promise<any[]>;

/**
 * Create postgres connection
 * @param options postgres connection option
 * @returns query handler
 */
export const createPostgresConnection = (
  options: iPostgresConfig,
): { query: QueryFunction; close: () => Promise<void> } => {
  try {
    const pool = new Pool({
      ...options,
      types: undefined,
    });

    /**
     * Execute SQL queries
     * @param sql query to be executed
     * @param variables query variables
     * @returns
     */
    const query = async (sql: string, variables: [] = []) => {
      try {
        debug(highlight(sql));
        const { rows } = await pool.query(sql, variables);
        return rows;
      } catch (error) {
        broadcast(chalk.red('[ERROR]'), chalk.reset('Failed to execute query:'), sql);
        throw error;
      }
    };

    /**
     * Close driver connection
     */
    const close = async () => {
      await pool.end();
    };
    return { query, close };
  } catch (error) {
    broadcast(chalk.red('[ERROR]'), chalk.reset('Failed to connect'), error);
    throw error;
  }
};
