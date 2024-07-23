import { iForeignDefinition } from '../types/column';
export declare const createForeignKey: (foreign: iForeignDefinition) => string;
export declare const dropForeignKey: (foreign: iForeignDefinition) => string;
