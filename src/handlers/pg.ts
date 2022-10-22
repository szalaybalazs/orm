import { Pool } from 'pg';
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
  const pool = new Pool({
    ...options,
  });

  /**
   * Execute SQL queries
   * @param sql query to be executed
   * @param variables query variables
   * @returns
   */
  const query = async (sql: string, variables: [] = []) => {
    const { rows } = await pool.query(sql, variables);
    return rows;
  };

  /**
   * Close driver connection
   */
  const close = async () => {
    await pool.end();
  };

  return { query, close };
};
