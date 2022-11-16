import { Command } from 'commander';
import { createBannerProgram } from './banner';
import { createChangesProgram } from './changes';
import { createDatabaseProgram, createDatabasePullProgram } from './database';
import { createEntityProgram } from './entity';
import { createMigrationProgram } from './migration';
import { generateEntityTypes } from './types';

const config = require('../../package.json');

const createProgram = (): Command => {
  const program = new Command();
  program.version(config.version, '-v, --version', 'Output the current version');

  createDatabaseProgram(program);
  createDatabasePullProgram(program);
  createBannerProgram(program);
  createChangesProgram(program);
  createEntityProgram(program);
  createMigrationProgram(program);
  generateEntityTypes(program);

  return program;
};

export const program = createProgram();
