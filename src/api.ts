import { parseConfig } from './core/config';
import { formatId } from './core/id';
import { iVerboseConfig } from './types';

import { generateMigration } from './migrations/generate';
import { runMutations } from './migrations/run';

export class Database {
  config: iVerboseConfig;

  constructor(params: any) {
    this.loadConfig(params);
  }

  loadConfig = async (params: any) => {
    this.config = await parseConfig(params);
    return this.config;
  };

  generateMigration = (name: string, options?: iVerboseConfig) =>
    generateMigration(formatId(name), name, { ...this.config, ...(options || {}) });

  runMigrations = (options?: iVerboseConfig) => runMutations({ ...this.config, ...(options || {}) });
}
