import { describe, test } from '@jest/globals';

import { getTables, loadEntities } from '../../src/entities/load';
import { generateQueries } from '../../src/migrations/sql';
import { iChanges } from '../../src/types/changes';

const changes: iChanges = {
  deleted: [],
  created: ['posts'],
  updated: [
    {
      key: 'users',
      changes: {
        changes: {
          id: [
            {
              key: 'generated',
              to: true,
            },
          ],
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
    const tables = getTables(entities);
    const queries = generateQueries(changes, tables);
    console.log(queries);
  });
});
