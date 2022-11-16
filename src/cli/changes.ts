import * as chalk from 'chalk';
import { Command } from 'commander';
import { parseConfig } from '../core/config';
import { debug } from '../core/log';
import { getEntities, loadEntities } from '../entities/load';
import { getChangesBetweenMigrations } from '../migrations/changes';
import { loadLastSnapshot } from '../snapshots';
import { generateQueries } from '../sql';
import { iTableChanges } from '../types';
import { addOptions } from './options';

/**
 * Create PostgresORM banner command
 * @param program commander program
 */
export const createChangesProgram = (program: Command) => {
  addOptions(program.command('show'))
    .summary('Show changes in entity definitions')
    .action(async (params) => {
      const options = await parseConfig(params);
      const { entitiesDirectory, snapshotsDirectory } = options;

      debug(chalk.dim('Loading entities and latest snapshot...'));
      const [entities, snapshot] = await Promise.all([
        loadEntities(entitiesDirectory),
        loadLastSnapshot(snapshotsDirectory),
      ]);

      debug(chalk.dim('Generating tables...'));
      const tables = getEntities(entities);

      debug(chalk.dim('Generating changes...'));
      const changes = getChangesBetweenMigrations(snapshot?.tables || {}, tables);

      debug(chalk.dim(JSON.stringify(changes, null, 2)));
      debug('');

      const queries = await generateQueries(changes, tables, snapshot?.tables);
      if (!queries?.up?.length) return console.log(chalk.bold('No changes found in schema.'));

      console.log(chalk.reset('Changes found in database schema:'));
      console.log('');
      changes.deleted.forEach((table) => {
        console.log(chalk.red(`- Dropped "${table}"`));
        console.log('');
      });

      changes.created.forEach((table) => {
        console.log(chalk.green(`+ Created "${table}"`));
        console.log('');
      });

      changes.updated.forEach((change) => {
        console.log(chalk.blue(`~ Updated "${change.key}"`));

        if (change.key === 'VIEW') {
        } else if (change.key === 'FUNCTION') {
        } else if (change.kind === 'TABLE') {
          const { changes } = change;
          changes.dropped.forEach((col) => {
            console.log(chalk.dim(`-   Dropped column "${col}"`));
          });
          Object.keys(changes.added).forEach((col) => {
            console.log(chalk.dim(`+   Added column "${col}"`));
          });
          Object.entries(changes.changes).forEach(([col, changes]) => {
            console.log(chalk.dim(`~   Update column "${col}":`));
            (changes as any).forEach((change) => {
              console.log(
                chalk.dim(`       Set "${change.key}": ${change.from || 'UNSET'} -> ${change.to || 'UNSET'}`),
              );
            });
            // changes.forEach(change => {
            //   change.
            // })
          });
          changes.indices.created.forEach((index) => {
            console.log(chalk.green(`+   Index created: "${index.name}"`));
          });
          changes.indices.dropped.forEach((index) => {
            console.log(chalk.red(`-   Index dropped: "${index.name}"`));
          });
          changes.indices.updated.forEach((index) => {
            console.log(chalk.blue(`~   Index updated: "${index.from.name}"`));
          });
          // console.log(changes);
        }
        console.log('');
      });
      changes.extensions?.added?.forEach((ext) => {
        console.log(chalk.green(`+ Extension added: "${ext}"`));
      });
      changes.extensions?.dropped?.forEach((ext) => {
        console.log(chalk.red(`- Extension removed: "${ext}"`));
      });

      changes.types?.created?.forEach((type) => {
        console.log(chalk.green(`+ Custom type created: "${type.name}"`));
      });
      changes.types?.deleted?.forEach((type) => {
        console.log(chalk.red(`- Custom type removed: "${type.name}"`));
      });
      changes.types?.updated?.forEach((type) => {
        console.log(chalk.blue(`~ Custom type updated: "${type.name}"`));
      });
    });
};
