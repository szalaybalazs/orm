import { iTableChangeInput } from '.';
import { iTableEntity } from '../../types';
import { iForeignChanges } from '../../types/changes';
import { iForeignDefinition } from '../../types/column';
/**
 * Get the changes in the foreign keys
 * @param change input
 * @returns foreign changes
 */
export declare const getForeignKeyChanges: ({ state, snapshot }: iTableChangeInput) => iForeignChanges;
/**
 * Get foreign keys of table
 * @param table table configuration
 * @returns foreign key definitions
 */
export declare const getForeignKeys: (table: iTableEntity) => iForeignDefinition[];
export declare const getForeignKeyName: (table: string, foreign: iForeignDefinition) => string;
