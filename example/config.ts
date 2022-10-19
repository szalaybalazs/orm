import { iOrmConfig } from '../src/types/config';

const config = async (): Promise<iOrmConfig> => {
  return {
    entities: './entities',
    migrations: './migrations',
    snapshots: './snapshots',
    namingConvention: 'CAMEL',
  };
};

export default config;
