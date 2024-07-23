import { tEntity } from '../types';
import { eNamingConvention } from '../types/config';
export declare const getKeys: (entity: tEntity, name: string) => string;
/**
 * Generate type script for a single entity
 * @param key kef of the entity
 * @param entity entity config
 * @returns name and type-string
 */
export declare const generateTypeForEntity: (key: string, entity: tEntity, namingConvention?: eNamingConvention, includeKeys?: boolean) => {
    name: string;
    keysName?: string;
    type: string;
};
/**
 * Generated the index.ts file, including all the named exports
 * @param types type list
 * @returns file content
 */
export declare const generateExports: (types: {
    key: string;
    keysName?: string;
    name: string;
}[]) => string;
