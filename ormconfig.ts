import { iOrmConfig } from './src/types/config';

const config = async (): Promise<iOrmConfig> => {
  return {
    driver: 'postgres',

    user: 'admin',
    password: 'password',
    database: 'orm-test',

    entities: './example/entities',
    migrations: './example/migrations',
    // snapshots: './example/snapshots',
    types: './example/types',

    namingConvention: 'CAMEL',

    verbose: true,
  };
};

export default config;
