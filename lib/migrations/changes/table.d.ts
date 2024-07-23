import { iTableChanges, iTableEntity } from '../../types';
/**
 * Generates all the changes for columns
 * @param oldEntity old table definition
 * @param newEntity new table definition
 * @returns
 */
export declare const getChangesForTables: (key: string, oldEntity: iTableEntity, newEntity: iTableEntity) => iTableChanges;
export declare const getFields: (entity: iTableEntity) => string[];
