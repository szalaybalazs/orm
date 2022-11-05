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
        const { rows } = await pool.query(sql, variables);
        return rows;
      } catch (error) {
        console.log('Failed to execute query:', sql);
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
    console.log('Failed to connect', error);
    throw error;
  }
};
