import { iTableEntity } from '../../types';
import { iCommentChanges } from '../../types/changes';

/**
 * Caclulate changes for comments
 * @param state current state of the table
 * @param snapshot previous state of the table
 * @returns
 */
export const getCommentChanges = (state: iTableEntity, snapshot: iTableEntity): iCommentChanges => {
  const changes: iCommentChanges = {};

  const columns = Array.from(new Set([...Object.keys(state.columns), ...Object.keys(snapshot.columns)]));

  columns.forEach((key) => {
    const newComment = state.columns?.[key]?.comment;
    const oldComment = snapshot.columns?.[key]?.comment;

    if (newComment === oldComment) return;

    changes[key] = {
      from: oldComment,
      to: newComment,
    };
  });

  return changes;
};
