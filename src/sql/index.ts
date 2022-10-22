import { iChanges } from '../types/changes';
import { iTableEntity, iTables, iViewEntity } from '../types/entity';
import { createTable, dropTable, updateTable } from './table';
import { createView, dropView } from './view';

/**
 * Generate schema changing SQL queries
 * @param changes changes between the two schemas
 * @param state current table definition
 * @param snapshot previous definitions
 * @returns schema changes
 */
export const generateQueries = async (
  changes: iChanges,
  state: iTables,
  snapshot: iTables,
): Promise<{ up: string[]; down: string[] }> => {
  const up: string[] = [];
  const down: string[] = [];

  // Handle removes
  const droppedPromise = changes.deleted.map(async (key) => {
    const entity = snapshot[key];
    // Drop table from current schema
    if (entity.type === 'VIEW') up.push(dropView(key));
    else up.push(dropTable(key));

    // Create table based on previous snapshot
    if (entity.type === 'VIEW') down.push(createView(entity));
    else down.push(await createTable(entity));
  });

  // Handle creates
  const createdPromise = changes.created.map(async (key) => {
    // Create table based on current schema
    const entity = state[key];

    if (entity.type === 'VIEW') up.push(createView(entity));
    else up.push(await createTable(entity));

    // Destroying table when reverted
    if (entity.type === 'VIEW') down.push(dropView(key));
    else down.push(dropTable(key));
  });

  // Handle updates
  const udpatedPromise = changes.updated.map(async (change) => {
    if (change.kind === 'VIEW') {
      if (change.changes.replace.up) up.push(dropView(change.key));
      if (change.changes.replace.down) down.push(dropView(change.key));

      up.push(createView(state[change.key] as iViewEntity));
      down.push(createView(snapshot[change.key] as iViewEntity));
    } else {
      const [transactionsUp, transactionsDown] = await updateTable(
        change.changes,
        state[change.key],
        snapshot[change.key],
      );

      // Commit changes to tables
      if (transactionsUp) up.push(...transactionsUp);

      // Revert changes
      if (transactionsDown) down.push(...transactionsDown);
    }
  });

  await Promise.all([...droppedPromise, ...createdPromise, ...udpatedPromise]);

  return { up, down };
};
