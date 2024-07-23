import { eAllTypes } from '../types/datatypes';
/**
 * Get typescript equivalent of the postgres type
 * @param type postgres type
 * @returns typesript type string
 */
export declare const getType: (type: eAllTypes, values?: string[], array?: boolean) => string;
