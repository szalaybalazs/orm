import { iChanges } from '../types/changes';
import { iTableEntity, iTables } from '../types/entity';
import { createTable, dropTable, updateTable } from './table';

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
    // Drop table from current schema
    up.push(dropTable(key));

    // Create table based on previous snapshot
    const table = snapshot[key];
    if (table.type !== 'VIEW') down.push(await createTable(table as iTableEntity));
  });

  // Handle creates
  const createdPromise = changes.created.map(async (key) => {
    // Create table based on current schema
    const table = state[key];
    if (table.type !== 'VIEW') up.push(await createTable(table as iTableEntity));

    // Destroying table when reverted
    down.push(dropTable(key));
  });

  // Handle updates
  const udpatedPromise = changes.updated.map(async (change) => {
    const [transactionsUp, transactionsDown] = await updateTable(
      change.changes,
      state[change.key],
      snapshot[change.key],
    );

    // Commit changes to tables
    if (transactionsUp) up.push(...transactionsUp);

    // Revert changes
    if (transactionsDown) down.push(...transactionsDown);
  });

  await Promise.all([...droppedPromise, ...createdPromise, ...udpatedPromise]);

  return { up, down };
};
