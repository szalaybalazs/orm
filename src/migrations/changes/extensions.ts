import { chalk } from '../../core/chalk';
import { debug } from '../../core/log';
import { getViewResolver } from '../../helpers/view';
import { eAllTypes, eExtension, iTables } from '../../types';

/**
 * Get extension changes between states
 * @param snapshot previous state of the database
 * @param state current state of the databse
 * @returns changes in extensions
 */
export const getExtensionChanges = (
  snapshot: iTables,
  state: iTables,
): { dropped: eExtension[]; added: eExtension[] } => {
  debug(chalk.dim('> Calculating changes in extensions'));
  const oldExtensions = getExtensions(snapshot);
  const newExtensions = getExtensions(state);

  const dropped = oldExtensions.filter((e) => !newExtensions.includes(e));
  const added = newExtensions.filter((e) => !oldExtensions.includes(e));

  return { dropped, added };
};

/**
 * Get all extensions from a state
 * @param state current state
 * @returns current extension list
 */
const getExtensions = (state: iTables): eExtension[] => {
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

/**
 * types and functions associated with table_func extension
 */
const tablefuncFunctions = ['normal_rand', 'crosstab', 'crosstabN', 'crosstab', 'crosstab', 'connectby'];

/**
 * Check SQL query for table_func extension
 * @param sql sql query
 * @returns whether sql uses table_func extension
 */
const checkForTableFunc = (sql: string): boolean => {
  return tablefuncFunctions.some((func) => sql.includes(func));
};
