import { describe, test } from '@jest/globals';
import { loadEntities } from '../entities/load';

describe('Entities', () => {
  test('Load entities from directory', async () => {
    const entities = await loadEntities('./example/entities');
    console.log(JSON.stringify(entities, null, 2));
  });
});
