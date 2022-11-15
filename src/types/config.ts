import { ClientConfig } from 'pg';

export interface iPostgresConfig extends Omit<ClientConfig, 'types'> {
  driver: 'postgres';
}

export type eNamingConvention = 'SNAKE' | 'CAMEL' | 'PASCAL';

export interface iOrmConfig extends iPostgresConfig {
  entities?: string; // | string[];
  migrations?: string; // | string[];
  snapshots?: string; // | string[];
  types?: string;
  namingConvention?: eNamingConvention;
  migrationsTable?: string;
  verbose?: boolean;
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
