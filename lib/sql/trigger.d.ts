import { iTableEntity } from '../types';
import { eTriggerType } from '../types/column';
/**
 * Updates trigger function
 * @param table
 * @param triggers
 * @returns
 */
export declare const updateTriggerFunction: (table: iTableEntity, kind?: eTriggerType) => Promise<string | null>;
/**
 * Creates a trigger function and attaches to the table
 * @param table
 * @param triggers
 * @returns
 */
export declare const createTrigger: (table: iTableEntity, kind?: eTriggerType) => Promise<string[]>;
/**
 * Drops update trigger function and trigger from table
 * @param table
 * @returns
 */
export declare const dropTrigger: (table: iTableEntity, kind?: eTriggerType) => string[];
