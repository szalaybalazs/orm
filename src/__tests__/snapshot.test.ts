import { describe, test } from '@jest/globals';
import { loadSnapshots } from '../snapshots';

describe('Snapshots', () => {
  test('Load snapshots', async () => {
    await loadSnapshots('./example/snapshots');
  });
  // test('Save snapshot', async () => {
  //   saveSnapshot('./example/snapshots', 'posts', { user, post });
  // });
});
