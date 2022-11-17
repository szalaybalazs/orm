import { chalk } from '../../core/chalk';
import { compareArrays } from '../../core/compare';
import { debug } from '../../core/log';
import { iTables, tColumn } from '../../types';
import { iTypeChange, iTypeChanges } from '../../types/changes';
import { iCustomType } from '../../types/types';

export const getTypeChanges = (snapshot: iTables, state: iTables): iTypeChanges => {
  debug(chalk.dim('> Calculating changes in types'));
  const oldTypes = getTypesFromState(snapshot);
  const newTypes = getTypesFromState(state);

  const created = newTypes.filter((t) => !oldTypes.find((type) => type.name === t.name));
  const deleted = oldTypes.filter((t) => !newTypes.find((type) => type.name === t.name));

  const updated = getChangedTypes(oldTypes, newTypes);

  return {
    created,
    deleted,
    updated,
  };
};

const getChangedTypes = (oldTypes: iCustomType[], newTypes: iCustomType[]): iTypeChange[] => {
  const updates: iTypeChange[] = [];

  const originalTypes = oldTypes.filter((t) => newTypes.find((type) => type.name === t.name));

  originalTypes.forEach((type) => {
    const newType = newTypes.find((t) => t.name === type.name);
    const hasChanged = !compareArrays(newType.values, type.values);

    if (hasChanged) {
      const added = newType.values.filter((f) => !type.values.includes(f));
      const removed = type.values.filter((f) => !newType.values.includes(f));

      updates.push({
        name: type.name,
        dependencies: newType.dependencies,
        new: newType,
        old: type,
        added,
        removed,
      });
    }
  });

  return updates;
};

const getTypesFromState = (state: iTables) => {
  const types: iCustomType[] = [];
  Object.entries(state).forEach(([table, entity]) => {
    if (entity.type === 'FUNCTION') return;

    const entityName = entity.name || table;
    const columns = Object.entries(entity.columns ?? {});

    columns.forEach(([key, column]: [string, tColumn]) => {
      if (column.kind === 'COMPUTED') return;
      if (column.kind === 'RESOLVED') return;
      if (column.type === 'enum') {
        const type: iCustomType = {
          name: column.name || `${entityName}_${key}_enum`,
          type: 'ENUM',
          values: column.enum.sort(),
          dependencies: [
            {
              table,
              columns: [key],
            },
          ],
        };

        types.push(type);
      }
    });
  });

  return types;
};
