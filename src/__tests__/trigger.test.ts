import { describe, test } from '@jest/globals';
import { loadSnapshots } from '../snapshots';
import { getTriggerChanges } from '../migrations/changes/trigger';
import { iTableEntity } from '../types';

const oldTable: iTableEntity = {
  name: 'old',
  columns: {
    name: {
      type: 'varchar',
      onUpdate: { set: '' },
    },
  },
  beforeInsert: { procedure: 'test' },
};
const newTable: iTableEntity = {
  name: 'new',
  columns: {
    name: {
      type: 'varchar',
      // onUpdate: { set: '' },
    },
  },
  // beforeInsert: { procedure: 'test' },
};
describe('Trigger', () => {
  test('Check for changes', async () => {
    const changes = await getTriggerChanges(oldTable, newTable);
    console.log(changes);
  });
  // test('Save snapshot', async () => {
  //   saveSnapshot('./example/snapshots', 'posts', { user, post });
  // });
});
