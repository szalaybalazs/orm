import { eNamingConvention } from '../types/config';
export declare const camelize: (s: string) => string;
export declare const pascalize: (s: string) => string;
export declare const snakelize: (s: string) => string;
export declare const convertKey: (key: string, naming?: eNamingConvention) => string;
export declare const snakeToCamel: (input: any, filter?: (e: any) => boolean, replacer?: (e: any) => string, original?: any) => any;
export declare const camelToSnake: (input: any, filter?: (e: any) => boolean, replacer?: (e: any) => string, original?: any) => any;
