import { loopOver } from '../core/loop';
import { iChanges, iTableEntity, iTables, iViewEntity, tEntity } from '../types';
import { createExtension, dropExtension } from './extension';
import { createFunction, dropFunction } from './function';
import { createTable, dropTable, updateTable } from './table';
import { addValue, createType, dropType, removeValue } from './types';
import { createView, dropView } from './view';

const points = {
  FUNCTION: 0,
  TABLE: 1,
  VIEW: 2,
};

const getPoints = (entity: tEntity) => points[entity.type || 'TABLE'];

// todo: creation order: extensions -> function -> table -> trigger & views
// todo: drop order: views -> trigger -> table & function -> extensions

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
  const droppedEntities = changes.deleted.sort((a, b) => {
    return getPoints(snapshot[b]) - getPoints(snapshot[a]);
  });
  const droppedPromise = loopOver(droppedEntities, async (key) => {
    const entity = snapshot[key];
    // Drop table from current schema
    if (entity.type === 'VIEW') up.push(dropView(entity));
    else if (entity.type === 'FUNCTION') up.push(dropFunction(entity));
    else up.push(dropTable(key));

    // Create table based on previous snapshot
    if (entity.type === 'VIEW') down.unshift(createView(entity));
    else if (entity.type === 'FUNCTION') down.unshift(createFunction(entity));
    else down.unshift(...(await createTable(entity)));
  });

  // Handle creates
  const createdEntities = changes.created.sort((a, b) => {
    return getPoints(state[a]) - getPoints(state[b]);
  });
  const createdPromise = loopOver(createdEntities, async (key) => {
    // Create table based on current schema
    const entity = state[key];

    if (entity.type === 'VIEW') up.push(createView(entity));
    else if (entity.type === 'FUNCTION') up.push(createFunction(entity));
    else up.push(...(await createTable(entity)));

    // Destroying table when reverted
    if (entity.type === 'VIEW') down.unshift(dropView(entity));
    else if (entity.type === 'FUNCTION') down.unshift(dropFunction(entity));
    else down.unshift(dropTable(key));
  });

  // Handle updates
  const updatedPromise = loopOver(changes.updated, async (change) => {
    if (change.kind === 'VIEW') {
      if (change.changes.replace.up) up.push(dropView(snapshot[change.key] as iViewEntity));
      if (change.changes.replace.down) down.unshift(dropView(state[change.key] as iViewEntity));

      up.push(createView(state[change.key] as iViewEntity));
      down.unshift(createView(snapshot[change.key] as iViewEntity));
    } else if (change.kind === 'FUNCTION') {
    } else {
      const [transactionsUp, transactionsDown] = await updateTable(
        change.changes,
        state[change.key] as iTableEntity,
        snapshot[change.key] as iTableEntity,
      );

      // Commit changes to tables
      if (transactionsUp) up.push(...transactionsUp);

      // Revert changes
      if (transactionsDown) down.unshift(...transactionsDown);
    }
  });

  await Promise.all([droppedPromise, createdPromise, updatedPromise]);

  // Handle Extensions
  if (changes.extensions) {
    changes.extensions.added.forEach((extension) => {
      up.unshift(createExtension(extension));
      down.push(dropExtension(extension));
    });
    changes.extensions.dropped.forEach((extension) => {
      up.unshift(dropExtension(extension));
      down.push(createExtension(extension));
    });
  }

  if (changes.types) {
    changes.types.deleted.forEach((type) => {
      up.unshift(dropType(type.name));
      down.push(createType(type.name, type.values));
    });

    changes.types.created.forEach((type) => {
      up.unshift(createType(type.name, type.values));
      down.push(dropType(type.name));
    });

    const typeChanges = changes.types.updated.map(async (type) => {
      if (type.removed.length) up.unshift(...(await removeValue(type.new, type.old.dependencies, state)));
      type.removed.forEach((value) => {
        down.push(addValue(type.name, value));
      });

      type.added.forEach((value) => {
        up.unshift(addValue(type.name, value));
      });
      if (type.added) down.push(...(await removeValue(type.old, type.new.dependencies, snapshot)));
    });

    await Promise.all(typeChanges);
  }

  return { up, down };
};
