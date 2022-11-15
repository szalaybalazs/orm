import { chalk } from '../../core/chalk';
import { debug } from '../../core/log';
import { getViewResolver } from '../../helpers/view';
import { eAllTypes, eExtension, iTables } from '../../types';

export const getExtensionChanges = (snapshot: iTables, state: iTables) => {
  debug(chalk.dim('> Calculating changes in extensions'));
  const oldExtensions = getExtensions(snapshot);
  const newExtensions = getExtensions(state);

  const dropped = oldExtensions.filter((e) => !newExtensions.includes(e));
  const added = newExtensions.filter((e) => !oldExtensions.includes(e));

  return { dropped, added };
};

const getExtensions = (state: iTables) => {
  const extensions = new Set<eExtension>();

  Object.values(state).forEach((entity) => {
    if (entity.type === 'FUNCTION') {
      if (checkForTableFunc(entity.body)) extensions.add('tablefunc');
    } else if (entity.type === 'VIEW') {
      const { query } = getViewResolver(entity.name, entity.resolver);
      if (checkForTableFunc(query)) extensions.add('tablefunc');
    }

    if (entity.type !== 'FUNCTION') {
      const types: eAllTypes[] = Object.values(entity.columns).map((column) => column.type);
      if (types.includes('uuid')) extensions.add('uuid');
    }
  });

  return Array.from(extensions);
};

const tablefuncFunctions = ['normal_rand', 'crosstab', 'crosstabN', 'crosstab', 'crosstab', 'connectby'];
const checkForTableFunc = (sql: string): boolean => {
  return tablefuncFunctions.some((func) => sql.includes(func));
};
