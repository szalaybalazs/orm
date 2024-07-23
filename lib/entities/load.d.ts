import { iTables, tEntity } from '../types';
import { tLoadedEntity } from '../types';
export declare const loadEntities: (directory: string) => Promise<tLoadedEntity[]>;
/**
 * Generate entity map from array
 *
 * Converts column keys to snake case
 * @param entities input array
 * @returns { [key: string]: entity } map
 */
export declare const getEntities: (entities: tEntity[]) => iTables;
