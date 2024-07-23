import { iTableEntity } from '../../types';
import { iCommentChanges } from '../../types/changes';
/**
 * Caclulate changes for comments
 * @param state current state of the table
 * @param snapshot previous state of the table
 * @returns
 */
export declare const getCommentChanges: (state: iTableEntity, snapshot: iTableEntity) => iCommentChanges;
