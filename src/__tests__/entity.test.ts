import { describe, test } from '@jest/globals';
import { loadEntities } from '../entities/load';

describe('Entities', () => {
  test('Load entities from directory', async () => {
    await loadEntities('./example/entities');
  });
});
