import * as chalk from 'chalk';
import { debug } from '../core/log';
import { getEntities, loadEntities } from '../entities/load';
import { loadLastSnapshot, saveSnapshot } from '../snapshots';
import { generateQueries } from '../sql';
import { iVerboseConfig } from '../types';
import { getChangesBetweenMigrations } from './changes';
import { createExtensionQueries, createExtensions } from './extensions';
import { saveMigration } from './filesystem';
import { getMigrationTemplate } from './template';

// todo: move extension creation to migration
// todo: save default value for stanpshots by running resolver functions when saving

/**
 * Generate new migration
 * @param id id of the migration
 * @param name name of the migrations
 * @param options configuration
 */
export const generateMigration = async (id: string, name: string, options: iVerboseConfig) => {
  const { entities: entityDirectory, snapshots: snapshotDirectory, migrations: migrationDirectory, verbose } = options;

  debug(verbose, chalk.gray('Loading entities and latest snapshot...'));
  const [entities, snapshot] = await Promise.all([loadEntities(entityDirectory), loadLastSnapshot(snapshotDirectory)]);

  debug(verbose, chalk.gray('Generating tables...'));
  const tables = getEntities(entities);

  debug(verbose, chalk.gray('Generating changes...'));
  const changes = getChangesBetweenMigrations(snapshot?.tables || {}, tables);

  debug(verbose, chalk.gray('Generating queries...'));
  const queries = await generateQueries(changes, tables, snapshot?.tables ?? {});

  debug(verbose, chalk.gray('Checking for changes...'));
  if (queries.up.length === 0) throw new Error('NO_CHANGES');

  // todo: check for changes in extensions to create only the necesarry ones

  debug(verbose, chalk.gray('Generating migration...'));
  const migration = getMigrationTemplate(id, name, queries.up, queries.down);

  if (options.dryrun) {
    return console.log(migration);
  }
  debug(verbose, chalk.gray('Saving migration and new snapshot...'));
  await Promise.all([saveMigration(id, migration, migrationDirectory), saveSnapshot(snapshotDirectory, id, tables)]);
};
