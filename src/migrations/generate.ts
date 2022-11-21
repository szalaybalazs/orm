import * as chalk from 'chalk';
import { prompt } from 'inquirer';
import { broadcast, debug } from '../core/log';
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
  const { entitiesDirectory, snapshotsDirectory, migrations: migrationDirectory, verbose } = options;

  debug(chalk.dim('Loading entities and latest snapshot...'));
  const [entities, snapshot] = await Promise.all([
    loadEntities(entitiesDirectory),
    loadLastSnapshot(snapshotsDirectory),
  ]);

  debug(chalk.dim('Generating tables...'));
  const tables = getEntities(entities);

  debug(chalk.dim('Generating changes...'));
  const changes = getChangesBetweenMigrations(snapshot?.tables || {}, tables);

  debug(chalk.dim('Generating queries...'));
  const queries = await generateQueries(changes, tables, snapshot?.tables ?? {});

  debug(chalk.dim('Checking for changes...'));
  if (queries.up.length === 0) throw new Error('NO_CHANGES');

  if (queries.up.some((sql) => sql.toLowerCase().includes(' drop '))) {
    const answers = await prompt([
      {
        type: 'confirm',
        name: 'drop',
        message: 'Migration may result in the loss of data, are you sure you want to continue?',
        default: false,
      },
    ]);
    if (!answers.drop) return broadcast(chalk.cyan('Skipping...'));
  }

  debug(chalk.dim('Generating migration...'));
  const migration = getMigrationTemplate(id, name, queries.up, queries.down);

  if (options.dryrun) return migration;
  debug(chalk.dim('Saving migration and new snapshot...'));
  await Promise.all([saveMigration(id, migration, migrationDirectory), saveSnapshot(snapshotsDirectory, id, tables)]);
};
