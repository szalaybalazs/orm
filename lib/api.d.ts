import { iVerboseConfig } from './types';
export declare class Database {
    config: iVerboseConfig;
    constructor(params?: any);
    loadConfig: (params: any) => Promise<iVerboseConfig>;
    generateMigration: (name: string, options?: iVerboseConfig) => Promise<string | void>;
    runMigrations: (options?: iVerboseConfig) => Promise<void>;
}
