import { describe, test } from '@jest/globals';

import { getEntities, loadEntities } from '../entities/load';
import { runMigration } from '../migrations';
import { generateQueries } from '../sql';
import { iChanges } from '../types';

const changes: iChanges = {
  deleted: [],
  created: ['posts'],
  updated: [
    {
      key: 'users',
      changes: {
        changes: {
          firstname: [
            {
              key: 'default',
              from: '',
              to: 'John',
            },
          ],
          lastname: [
            {
              key: 'default',
              from: '',
              to: 'Doe',
            },
          ],
        },
        dropped: ['password'],
        added: {
          email: {
            type: 'varchar',
            unique: true,
          },
        },
      },
    },
  ],
};

describe('Migrations', () => {
  test('Generate SQL migration', async () => {
    const entities = await loadEntities('./example/entities');
    const tables = getEntities(entities);
    const queries = await generateQueries(changes, tables, {});

    console.log(queries);
  });

  test('Generate new migration from changes', async () => {
    await runMigration('added post title', './example/entities', './example/snapshots', './example/migrations');
  });
});
