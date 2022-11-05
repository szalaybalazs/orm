import { describe, test } from '@jest/globals';
import { pullSchema } from '../database/pull';
import { getEntities, loadEntities } from '../entities/load';
import { saveEntities } from '../entities/save';
import { getChangesBetweenMigrations } from '../migrations/changes';

import { loadLastSnapshot } from '../snapshots';

describe('Database', () => {
  test('Pull database schema', async () => {
    const entities = await pullSchema({ database: 'orm-test', driver: 'postgres', verbose: true });
    await saveEntities(entities, './example/entities');
  });
});
