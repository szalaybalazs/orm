import { deepEqual } from '../../core/object';
import { iIndex, iIndexChange } from '../../types';

// By default uses the standard naming convention
// https://gist.github.com/popravich/d6816ef1653329fb1745

// todo: show warning if multiple indices have the same name but different settings

export const getIndexChanges = (table: string, oldIndices: iIndex[], newIndices: iIndex[]): iIndexChange => {
  const oldNamedIndicies = oldIndices.map((index) => ({ ...index, name: getIndexName(table, index) }));
  const newNamedIndices = newIndices.map((index) => ({ ...index, name: getIndexName(table, index) }));

  const oldNames = Array.from(new Set(oldNamedIndicies.map((index) => index.name)));
  const newNames = Array.from(new Set(newNamedIndices.map((index) => index.name)));

  const newNamedIndicesFiltered = newNames.map((n) => newNamedIndices.find((index) => index.name === n));

  const dropped = oldNamedIndicies.filter((index) => !newNames.includes(index.name));
  const created = newNamedIndicesFiltered.filter((index) => !oldNames.includes(index.name));

  const same = newNamedIndices.filter((index) => oldNames.includes(index.name));
  const updatedIndices = same.map((newIndex) => {
    const oldIndex = oldNamedIndicies.find((i) => i.name === newIndex.name);

    if (!newIndex || !oldIndex) return null;
    const isSame = deepEqual(oldIndex, newIndex);

    if (isSame) return null;
    return { from: oldIndex, to: newIndex };
  });
  const updated = updatedIndices.filter(Boolean);

  return {
    dropped,
    updated,
    created,
  };
};

export const getIndexName = (table: string, index: iIndex) => {
  if (index?.name) return index.name;
  const columns = [...index.columns?.map((c) => (typeof c === 'string' ? c : c.column)), ...(index.includes ?? [])];

  const methodName = index.method && index.method !== 'btree' ? index.method : undefined;
  if (methodName) columns.unshift(methodName);

  return `${table}_${columns.join('_')}_idx`;
};
