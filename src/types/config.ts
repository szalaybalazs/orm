export interface iOrmConfig {
  entities?: string | string[];
  migrations?: string | string[];
  snapshots?: string | string[];
  namingConvention?: 'SNAKE' | 'CAMEL';
}
