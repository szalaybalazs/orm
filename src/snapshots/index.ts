import { existsSync, mkdirsSync, pathExistsSync, readdir, readFile, writeFile } from 'fs-extra';
import { join } from 'path';
import { chalk } from '../core/chalk';
import { debug } from '../core/log';
import { snakelize } from '../core/naming';
import { getViewResolver } from '../helpers/view';
import { iSnapshot, iTables, tEntity } from '../types';

/**
 * Load all the snapshots from the defined directory
 * @param directory directory containing all the snapshot
 * @returns
 */
export const loadSnapshots = async (directory: string): Promise<iSnapshot[]> => {
  try {
    debug(chalk.dim(`> Loading snapshots from: ${directory}`));
    const content = await readdir(directory);

    const files = content.filter((file) => file.endsWith('.snapshot'));

    // todo: handle malformed files
    const snapshots = await Promise.all(
      files.map(async (file) => {
        const snapshotPath = join(directory, file);
        const rawSnapshot = await readFile(snapshotPath, 'utf8').catch(() => null);
        if (!rawSnapshot) return;
        const snapshot = JSON.parse(rawSnapshot);
        return {
          ...snapshot,
          timestamp: new Date(snapshot.timestamp),
          tables: Object.entries(snapshot.tables).reduce((acc, [key, table]: [string, tEntity]) => {
            if (table.type !== 'FUNCTION') {
              table.columns = Object.entries(table.columns).reduce((acc, [key, column]) => {
                return { ...acc, [snakelize(key)]: column };
              }, {});
            }
            return { ...acc, [key]: table };
          }, {}),
        };
      }),
    );

    const validSnapshots: iSnapshot[] = snapshots.filter(Boolean);

    return validSnapshots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    return [];
  }
};

export const loadLastSnapshot = async (directory: string): Promise<iSnapshot | null> => {
  debug(chalk.dim(`> Getting last snapshot from list`));
  const snapshots = await loadSnapshots(directory);
  return snapshots[0] || null;
};

export const getSnapshotTables = (state: iTables): iTables => {
  debug(chalk.dim(`> Filtering out all the non-table entities`));
  const tableMap: iTables = Object.entries(state).reduce((acc, [key, table]) => {
    if (table.type === 'VIEW') table.resolver = getViewResolver(table.name || key, table.resolver).query;
    return { ...acc, [key]: table };
  }, {});

  return tableMap;
};

export const saveSnapshot = async (directory: string, id: string, state: iTables) => {
  const snapshot: iSnapshot = { id, timestamp: new Date(), tables: getSnapshotTables(state) };
  const rawSnapshot = JSON.stringify(snapshot, null, 2);

  debug(chalk.dim(`> Generating raw snapshot data`));

  const fileName = join(directory, `${Math.round(Date.now() / 1000)}-${id}.snapshot`);

  if (!pathExistsSync(directory)) mkdirsSync(directory);
  if (existsSync(fileName)) throw new Error('EXISTS');

  debug(chalk.dim(`> Saving snapshot to file`));
  await writeFile(fileName, rawSnapshot, { encoding: 'utf-8' });
};
