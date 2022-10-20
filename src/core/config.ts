import { existsSync, readFileSync } from 'fs-extra';
import { isAbsolute, join } from 'path';
import { iOrmConfig } from '../types/config';

interface iVerboseConfig extends iOrmConfig {
  verbose?: boolean;
}

// Supported config files
const configFiles = ['ormconfig.js', 'ormconfig.ts', 'ormconfig.json'];

/**
 * Parse config path and load orm config
 * @param basePath input path - can be either a directory or a file
 * @returns orm config
 */
export const loadFile = async (basePath: string = '.'): Promise<iVerboseConfig> => {
  const base = isAbsolute(basePath) ? basePath : join(process.cwd(), basePath);

  const isExact = configFiles.some((f) => base.endsWith(f));

  if (isExact) return loadConfig(base);

  const paths = configFiles.map((file) => join(base, file));
  const path = paths.find((file) => {
    return existsSync(file);
  });

  if (!path) throw new Error('CONFIG_MISSING');

  return loadConfig(path);
};

/**
 * Load config file from path
 * @param path path to the config file
 * @returns orm config
 */
const loadConfig = async (path: string): Promise<iVerboseConfig> => {
  // throwing error if no file found
  if (!existsSync(path)) throw new Error('CONFIG_MISSING');

  // Loading JS and TS files
  if (path.endsWith('.ts') || path.endsWith('.js')) {
    const config = await import(path);

    const _config = config.default || config[Object.keys(config)[0]];
    return typeof _config === 'function' ? await _config() : _config;
  }

  // Loading json files
  if (path.endsWith('.json')) {
    const json = readFileSync(path, 'utf-8');
    return JSON.parse(json);
  }

  // todo: handle other files types
  // - yml

  throw new Error('CONFIG_WRONG_FORMAT');
};

/**
 * Parse config based on command params
 * @param params input params
 * @returns orm config
 */
export const parseConfig = async (params: any): Promise<iVerboseConfig> => {
  const config: iOrmConfig = await loadFile(params.config).catch((err) => {
    if (err === 'CONFIG_MISSING') {
      console.log('No config file found, using default value...');
      return {};
    }
    console.log(err);
    // todo: handle errors
    return {};
  });

  return { ...config, ...params };
};
