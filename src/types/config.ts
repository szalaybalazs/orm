import { ClientConfig } from 'pg';

export interface iPostgresConfig extends ClientConfig {
  driver: 'postgres';
}

export interface iOrmConfig extends iPostgresConfig {
  entities?: string; // | string[];
  migrations?: string; // | string[];
  snapshots?: string; // | string[];
  namingConvention?: 'SNAKE' | 'CAMEL';
  migrationsTable?: string;
}

export interface iVerboseConfig extends iOrmConfig {
  dryrun?: boolean;
  verbose?: boolean;
}

export interface iQueryOptions {
  migrationsTable: string;
  schema: string;
}
