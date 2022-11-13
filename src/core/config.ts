import { ensureDir, existsSync, readFileSync } from 'fs-extra';
import { isAbsolute, join } from 'path';
import { program } from '../cli';
import { iOrmConfig, iVerboseConfig } from '../types';
import { chalk } from './chalk';
import { debug } from './log';

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
  debug(params.verbose, chalk.gray('Loading orm config...'));
  const config: iOrmConfig = await loadFile(params.config).catch((err) => {
    if (err === 'CONFIG_MISSING') {
      debug(params.verbose, chalk.gray('No config file found, using default value...'));
      return {
        driver: 'postgres',
      };
    }
    // todo: handle errors
    program.error(`Failed to load config: ${err.message}`);
    return { driver: 'postgres' };
  });

  const configuration = { ...config, ...params };
  const entitiesDirectory = getDirectory(configuration.entities || '.orm/entities');
  const migrationsDirectory = getDirectory(configuration.migrations || '.orm/migrations');
  const snapshotsDirectory = getDirectory(configuration.snapshots || '.orm/snapshots');
  const typesDirectory = getDirectory(configuration.types || 'types');

  // Creating directories if they dont exist
  await Promise.all([
    ensureDir(entitiesDirectory),
    ensureDir(migrationsDirectory),
    ensureDir(snapshotsDirectory),
    ensureDir(typesDirectory),
  ]);

  return { ...configuration, entitiesDirectory, migrationsDirectory, snapshotsDirectory, typesDirectory };
};

const getDirectory = (dir: string) => {
  if (isAbsolute(dir)) return dir;
  return join(process.cwd(), dir || '.');
};
