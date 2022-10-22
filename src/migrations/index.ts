import * as chalk from 'chalk';
import { existsSync, mkdirSync, pathExistsSync, writeFile } from 'fs-extra';
import { join } from 'path';
import { debug } from '../core/log';
import { getTables, loadEntities } from '../entities/load';
import { loadLastSnapshot, saveSnapshot } from '../snapshots';
import { generateQueries } from '../sql';
import { iVerboseConfig } from '../types/config';
import { getChangesBetweenMigrations } from './changes';
import { getMigrationTemplate } from './template';

// todo: move extension creation to migration
// todo: save default value for stanpshots by running resolver functions when saving

export const runMigration = async (id: string, name: string, options: iVerboseConfig) => {
  const { entities: entityDirectory, snapshots: snapshotDirectory, migrations: migrationDirectory, verbose } = options;

  debug(verbose, chalk.gray('Loading entities and latest snapshot...'));
  const [entities, snapshot] = await Promise.all([loadEntities(entityDirectory), loadLastSnapshot(snapshotDirectory)]);

  debug(verbose, chalk.gray('Generating tables...'));
  const tables = getTables(entities);

  debug(verbose, chalk.gray('Generating changes...'));
  const changes = getChangesBetweenMigrations(snapshot?.tables || {}, tables);

  debug(verbose, chalk.gray('Generating queries...'));
  const queries = await generateQueries(changes, tables, snapshot?.tables ?? {});

  if (queries.up.length === 0) throw new Error('NO_CHANGES');

  debug(verbose, chalk.gray('Generating migration...'));
  const migration = getMigrationTemplate(id, name, queries.up, queries.down);

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

export const createEmptyMigration = async (id: string, name: string, options: iVerboseConfig) => {
  const migration = getMigrationTemplate(id, name, [], []);
  await saveMigration(id, migration, options.migrations);
};
