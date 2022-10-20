import { existsSync, readFile, readFileSync } from 'fs-extra';
import { isAbsolute, join } from 'path';
import { iOrmConfig } from '../types/config';

const configFiles = ['ormconfig.js', 'ormconfig.ts', 'ormconfig.json'];

export const loadFile = async (basePath: string = '.'): Promise<iOrmConfig> => {
  const base = isAbsolute(basePath) ? basePath : join(process.cwd(), basePath);

  const isExact = configFiles.some((f) => base.endsWith(f));

  console.log(base, isExact);
  if (isExact) return loadConfig(base);

  const paths = configFiles.map((file) => join(base, file));
  const path = paths.find((file) => {
    return existsSync(file);
  });

  if (!path) throw new Error('CONFIG_MISSING');

  return loadConfig(path);
};

const loadConfig = async (path: string): Promise<iOrmConfig> => {
  if (!existsSync(path)) throw new Error('CONFIG_MISSING');
  if (path.endsWith('.ts') || path.endsWith('.js')) {
    const config = await import(path);

    const _config = config.default || config[Object.keys(config)[0]];
    return typeof _config === 'function' ? await _config() : _config;
  }

  if (path.endsWith('.json')) {
    const json = readFileSync(path, 'utf-8');
    return JSON.parse(json);
  }

  throw new Error('CONFIG_WRONG_FORMAT');
};

export const parseConfig = async (params: any) => {
  const config: iOrmConfig = await loadFile(params.config).catch((err) => {
    console.log(err);
    return {};
  });

  const options = { ...config, ...params };

  return options;
};
