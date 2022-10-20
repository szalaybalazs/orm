import { iOrmConfig } from './src/types/config';

const config = async (): Promise<iOrmConfig> => {
  return {
    entities: './example/entities',
    migrations: './example/migrations',
    snapshots: './example/snapshots',
    namingConvention: 'CAMEL',
  };
};

export default config;
