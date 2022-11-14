import { Command } from 'commander';
import { createBannerProgram } from './banner';
import { createDatabaseProgram, createDatabasePullProgram } from './database';
import { createEntityProgram } from './entity';
import { createMigrationProgram } from './migration';
import { generateEntityTypes } from './types';

const createProgram = (): Command => {
  const program = new Command();
  program.version('0.0.1', '-v, --version', 'Output the current version');

  createDatabaseProgram(program);
  createDatabasePullProgram(program);
  createBannerProgram(program);
  createEntityProgram(program);
  createMigrationProgram(program);
  generateEntityTypes(program);

  return program;
};

export const program = createProgram();
