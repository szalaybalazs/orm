import { iOrmConfig, iVerboseConfig } from '../types';
/**
 * Parse config path and load orm config
 * @param basePath input path - can be either a directory or a file
 * @returns orm config
 */
export declare const loadFile: (basePath?: string) => Promise<iVerboseConfig>;
/**
 * Parse config based on command params
 * @param params input params
 * @returns orm config
 */
export declare const parseConfig: (params: any) => Promise<iVerboseConfig>;
/**
 * Save orm config to file
 * @param config
 */
export declare const saveConfig: (config: iOrmConfig) => Promise<void>;
