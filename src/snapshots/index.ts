import { join } from 'path';
import { readdir, readFile, existsSync, writeFile } from 'fs-extra';
import { iSnapshot, iTables } from '../types/entity';

/**
 * Load all the snapshots from the defined directory
 * @param directory directory containing all the snapshot
 * @returns
 */
export const loadSnapshots = async (directory: string) => {
  const path = join(process.cwd(), directory);
  const content = await readdir(path);

  const files = content.filter((file) => file.endsWith('.snapshot'));

  // todo: handle malformed files
  const snapshots = await Promise.all(
    files.map(async (file) => {
      const snapshotPath = join(path, file);
      const rawSnapshot = await readFile(snapshotPath, 'utf8').catch(() => null);
      if (!rawSnapshot) return;
      const snapshot = JSON.parse(rawSnapshot);
      return { ...snapshot, timestamp: new Date(snapshot.timestamp) };
    }),
  );

  const validSnapshots: iSnapshot[] = snapshots.filter(Boolean);

  return validSnapshots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const loadLastSnapshot = async (directory: string) => {
  const snapshots = await loadSnapshots(directory);
  return snapshots[0];
};

export const saveSnapshot = async (directory: string, id: string, state: iTables) => {
  const snapshot: iSnapshot = { id, timestamp: new Date(), tables: state };
  const rawSnapshot = JSON.stringify(snapshot);

  const fileName = join(process.cwd(), directory, `${id}.snapshot`);
  if (existsSync(fileName)) throw new Error('Snapshot already exists with the same ID');

  await writeFile(fileName, rawSnapshot, { encoding: 'utf-8' });
};
