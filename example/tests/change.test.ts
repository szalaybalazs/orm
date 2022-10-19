import { describe, expect, test } from '@jest/globals';
import { getChangesBetweenMigrations } from '../../src/migrations/changes';

import user from '../entities/user.entity';
const snapshot = require('../snapshots/init.json');

describe('Migrations', () => {
  test('Summarise changes between migrations', () => {
    const changes = getChangesBetweenMigrations(snapshot.tables, { user });
    console.log(JSON.stringify(changes, null, 2));
  });
});
