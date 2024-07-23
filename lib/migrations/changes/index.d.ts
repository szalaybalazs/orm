import { iChanges, iTableEntity, iTables } from '../../types';
export interface iTableChangeInput {
    state: iTableEntity;
    snapshot: iTableEntity;
}
/**
 * Get changes to be generated to the migrations
 * @param snapshot previous state
 * @param state current state
 * @returns
 */
export declare const getChangesBetweenMigrations: (snapshot: iTables, state: iTables) => iChanges;
