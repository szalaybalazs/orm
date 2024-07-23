import { iTables } from '../types';
import { iCustomType, iDependency } from '../types/types';
export declare const createType: (name: string, values: string[]) => string;
export declare const dropType: (name: string) => string;
export declare const addValue: (name: string, value: string) => string;
export declare const removeValue: (type: iCustomType, dependencies: iDependency[], state: iTables) => Promise<string[]>;
