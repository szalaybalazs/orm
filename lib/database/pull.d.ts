import { iIndex, iVerboseConfig, tEntity } from '../types';
/**
 * Get current the schema of the database
 * @param options connection options
 * @returns entity map
 */
export declare const pullSchema: (options: iVerboseConfig) => Promise<{
    [key: string]: tEntity;
}>;
export declare const parseIndexDefinition: (definition: string) => iIndex;
