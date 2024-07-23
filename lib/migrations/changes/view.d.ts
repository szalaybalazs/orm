import { iViewChanges, iViewEntity } from '../../types';
/**
 * Get changes between previous and current view
 * Determine whether the old view should be dropped or replace is enough
 * @param oldView the old view config
 * @param newView the new view config
 * @returns changes between the views
 */
export declare const getChangesForViews: (oldView: iViewEntity, newView: iViewEntity) => iViewChanges;
