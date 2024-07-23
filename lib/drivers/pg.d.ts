import { iPostgresConfig } from '../types';
export type QueryFunction = (sql: string, variables?: any[]) => Promise<any[]>;
/**
 * Create postgres connection
 * @param options postgres connection option
 * @returns query handler
 */
export declare const createPostgresConnection: (options: iPostgresConfig) => {
    query: QueryFunction;
    close: () => Promise<void>;
};
