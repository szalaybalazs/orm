import { iSnapshot, iTables } from '../types';
/**
 * Load all the snapshots from the defined directory
 * @param directory directory containing all the snapshot
 * @returns
 */
export declare const loadSnapshots: (directory: string) => Promise<iSnapshot[]>;
export declare const loadLastSnapshot: (directory: string) => Promise<iSnapshot | null>;
export declare const getSnapshotTables: (state: iTables) => iTables;
export declare const saveSnapshot: (directory: string, id: string, state: iTables) => Promise<void>;
