import { iTableEntity } from '../../types';
import { iTriggerChanges } from '../../types/changes';
import { eTriggerType, iUpdaterFunction } from '../../types/column';
import { iProcedure } from '../../types/entity';
/**
 * Get updaters for a table
 * @param table
 * @param kind
 * @returns
 */
export declare const getUpdaters: (table: iTableEntity, kind: eTriggerType) => {
    key: string;
    updater: iUpdaterFunction<number | import("../../types").DefaultFunction<number>> | iUpdaterFunction<Date | ("CURRENT_TIMESTAMP" | "NOW()" | "now()" | "now" | "today" | "tomorrow" | "yesterday") | import("../../types").DefaultFunction<Date | ("CURRENT_TIMESTAMP" | "NOW()" | "now()" | "now" | "today" | "tomorrow" | "yesterday")>> | iUpdaterFunction<string | import("../../types").DefaultFunction<string>> | iUpdaterFunction<boolean | import("../../types").DefaultFunction<boolean>>;
}[];
/**
 * Get procedure for a table and a trigger kind
 * @param table
 * @param kind
 * @returns
 */
export declare const getProcedure: (table: iTableEntity, kind: eTriggerType) => iProcedure;
/**
 * Get trigger changes for a table and a snapshot
 * @param oldTable
 * @param newTable
 * @returns
 */
export declare const getTriggerChanges: (oldTable: iTableEntity, newTable: iTableEntity) => Partial<iTriggerChanges>;
