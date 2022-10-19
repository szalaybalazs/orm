import { iOrmConfig } from '../src/types/config';

const config = async (): Promise<iOrmConfig> => {
  return {
    namingConvention: 'CAMEL',
  };
};

export default config;
