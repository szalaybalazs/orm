import { Command } from 'commander';
import { createBannerProgram } from './banner';
import { createEntityProgram } from './entity';
import { createMigraationProgram } from './migration';

const createProgram = (): Command => {
  const program = new Command();
  program.version('0.0.1', '-v, --version', 'Output the current version');

  createBannerProgram(program);
  createEntityProgram(program);
  createMigraationProgram(program);

  return program;
};

export const program = createProgram();
