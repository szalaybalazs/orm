import { describe, expect, test } from '@jest/globals';
import { getEntities, loadEntities } from '../entities/load';
import { getChangesBetweenMigrations } from '../migrations/changes';

import { loadLastSnapshot } from '../snapshots';

describe('Migrations', () => {
  test('Summarise changes between migrations', async () => {
    const snapshot = await loadLastSnapshot('./example/snapshots');
    const entities = await loadEntities('./example/entities');

    const tables = getEntities(entities);

    const changes = getChangesBetweenMigrations(snapshot.tables, tables);

    console.log(JSON.stringify(changes, null, 2));
  });
});
