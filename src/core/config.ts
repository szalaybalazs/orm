import { ensureDir, existsSync, readFileSync, writeFileSync } from 'fs-extra';
import { isAbsolute, join } from 'path';
import { program } from '../cli';
import { iOrmConfig, iVerboseConfig } from '../types';
import { prettier } from '../utils/formatter';
import { chalk } from './chalk';
import { broadcast, debug, formatObject } from './log';

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
  if (params.verbose) broadcast(chalk.dim('Loading orm config...'));
  const config: iOrmConfig = await loadFile(params.config).catch((err) => {
    if (err === 'CONFIG_MISSING') {
      if (params.verbose) broadcast(chalk.dim('No config file found, using default value...'));
      return {
        driver: 'postgres',
      };
    }
    // todo: handle errors
    program.error(`Failed to load config: ${err.message}`);
    return { driver: 'postgres' };
  });

  const configuration = { ...config, ...params };
  const entitiesDirectory = getDirectory(configuration.entities || '.orm/entities', params.config);
  const migrationsDirectory = getDirectory(configuration.migrations || '.orm/migrations', params.config);
  const snapshotsDirectory = getDirectory(configuration.snapshots || '.orm/snapshots', params.config);
  const typesDirectory = getDirectory(configuration.types || '.', params.config);

  // Creating directories if they dont exist
  await Promise.all([
    ensureDir(entitiesDirectory),
    ensureDir(migrationsDirectory),
    ensureDir(snapshotsDirectory),
    ensureDir(typesDirectory),
  ]);

  const res = {
    ...configuration,
    entitiesDirectory,
    migrationsDirectory,
    snapshotsDirectory,
    typesDirectory: configuration.types && typesDirectory,
  };

  global.config = res;
  if (res.verbose) process.env.DEBUG = 'orm';

  debug();
  debug(chalk.dim('Options loaded: '));
  debug(chalk.dim(formatObject(res)));

  return res;
};

const getDirectory = (dir: string, configFile: string) => {
  if (isAbsolute(dir)) return dir;
  const segments = configFile.split('/');
  if (configFile.endsWith('.js') || configFile.endsWith('.ts') || configFile.endsWith('.json')) segments.pop();
  const configDir = segments.join('/');
  if (isAbsolute(configDir)) return join(configDir, dir || '.');
  return join(process.cwd(), configDir, dir || '.');
};

const typeImport = process.env.NODE_ENV === 'development' ? './src/types' : 'undiorm/src/types';
const template = `import { iOrmConfig } from '${typeImport}';

const config = async (): Promise<iOrmConfig> => {
  return __TEMPLATE__
};

export default config;
`;

/**
 * Save orm config to file
 * @param config
 */
export const saveConfig = async (config: iOrmConfig) => {
  try {
    const content = prettier(template.replace('__TEMPLATE__', JSON.stringify(config)), { parser: 'babel-ts' });
    writeFileSync(join(process.cwd(), '.ormconfig.ts'), content as string, 'utf-8');
  } catch (error) {}
};
