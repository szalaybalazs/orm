import { ClientConfig } from 'pg';
export interface iPostgresConfig extends Omit<ClientConfig, 'types'> {
    driver: 'postgres';
}
export type eNamingConvention = 'SNAKE' | 'CAMEL' | 'PASCAL';
export interface iOrmConfig extends iPostgresConfig {
    entities?: string;
    migrations?: string;
    snapshots?: string;
    types?: string;
    includeKeysInTypes?: boolean;
    namingConvention?: eNamingConvention;
    migrationsTable?: string;
    verbose?: boolean;
    extraOptions?: {
        [key: string]: string | number | boolean;
    };
    schema?: string;
}
export interface iVerboseConfig extends iOrmConfig {
    dryrun?: boolean;
    verbose?: boolean;
    entitiesDirectory: string;
    migrationsDirectory: string;
    snapshotsDirectory: string;
    typesDirectory?: string;
}
export interface iQueryOptions {
    migrationsTable: string;
    schema: string;
}
