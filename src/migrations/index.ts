import * as chalk from 'chalk';
import { existsSync, writeFile, pathExistsSync, mkdirSync } from 'fs-extra';
import { join } from 'path';
import { debug } from '../core/log';
import { getTables, loadEntities } from '../entities/load';
import { loadLastSnapshot, saveSnapshot } from '../snapshots';
import { getChangesBetweenMigrations } from './changes';
import { generateQueries } from './sql';
import { getMigrationTemplate } from './template';

export const getMigrationContent = (id: string, up: string[]) => {
  return getMigrationTemplate(id, up);
};

export const runMigration = async (
  id: string,
  entityDirectory: string,
  snapshotDirectory: string,
  migrationDirectory: string,
  verbose: boolean = false,
) => {
  debug(verbose, chalk.gray('Loading entities and latest snapshot...'));
  const [entities, snapshot] = await Promise.all([loadEntities(entityDirectory), loadLastSnapshot(snapshotDirectory)]);

  debug(verbose, chalk.gray('Generating tables...'));
  const tables = getTables(entities);

  debug(verbose, chalk.gray('Generating changes...'));
  const changes = getChangesBetweenMigrations(snapshot?.tables || {}, tables);

  debug(verbose, chalk.gray('Generating queries...'));
  const queries = generateQueries(changes, tables);

  if (queries.length === 0) throw new Error('NO_CHANGES');

  debug(verbose, chalk.gray('Generating migration...'));
  const migration = getMigrationContent(id, queries);

  debug(verbose, chalk.gray('Saving migration and new snapshot...'));
  await Promise.all([saveMigration(id, migration, migrationDirectory), saveSnapshot(snapshotDirectory, id, tables)]);
};

export const saveMigration = async (id: string, content: string, migrationDirectory: string) => {
  const base = join(process.cwd(), migrationDirectory);
  const fileName = join(base, `${Math.round(Date.now() / 1000)}-${id}.migration.ts`);
  if (!pathExistsSync(base)) mkdirSync(base);
  if (existsSync(fileName)) throw new Error('Snapshot already exists with the same ID');

  await writeFile(fileName, content, { encoding: 'utf-8' });
};
