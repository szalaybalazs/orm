import { describe, test } from '@jest/globals';
import { loadSnapshots, saveSnapshot } from '../../src/snapshots';
import user from '../entities/user.entity';
import post from '../entities/post.entity';
describe('Snapshots', () => {
  test('Load snapshots', async () => {
    const snapshots = await loadSnapshots('./example/snapshots');
    console.log(JSON.stringify(snapshots, null, 2));
  });
  // test('Save snapshot', async () => {
  //   saveSnapshot('./example/snapshots', 'posts', { user, post });
  // });
});
