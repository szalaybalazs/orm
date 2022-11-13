import { ClientConfig } from 'pg';

export interface iPostgresConfig extends Omit<ClientConfig, 'types'> {
  driver: 'postgres';
}

export interface iOrmConfig extends iPostgresConfig {
  entities?: string; // | string[];
  migrations?: string; // | string[];
  snapshots?: string; // | string[];
  types?: string;
  namingConvention?: 'SNAKE' | 'CAMEL';
  migrationsTable?: string;
}

export interface iVerboseConfig extends iOrmConfig {
  dryrun?: boolean;
  verbose?: boolean;

  entitiesDirectory: string;
  migrationsDirectory: string;
  snapshotsDirectory: string;
}

export interface iQueryOptions {
  migrationsTable: string;
  schema: string;
}
