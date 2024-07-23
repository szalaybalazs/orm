import { iViewEntity } from '../types';
/**
 * Create new view
 * @param view view config
 * @returns SQL Query
 */
export declare const createView: (view: iViewEntity) => string;
/**
 * Drop existing view by config
 * @param view view config
 * @returns SQL Query
 */
export declare const dropView: (view: iViewEntity) => string;
