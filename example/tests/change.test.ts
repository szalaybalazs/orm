import { describe, expect, test } from '@jest/globals';
import { getChangesBetweenMigrations } from '../../src/migrations/changes';

import user from '../entities/user.entity';
import post from '../entities/department.entity';
import attachment from '../entities/employee.entity';
import comment from '../entities/comment.entity';
import { loadLastSnapshot } from '../../src/snapshots';

describe('Migrations', () => {
  test('Summarise changes between migrations', async () => {
    const snapshot = await loadLastSnapshot('./example/snapshots');

    const changes = getChangesBetweenMigrations(snapshot.tables, { user, post, attachment, comment });

    console.log(JSON.stringify(changes, null, 2));
  });
});
