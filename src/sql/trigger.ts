import { iTableEntity } from '../types';
import { iTriggerChange } from '../types/changes';

/**
 * Get the name of the trigger function
 * DO NOT CHANGE THIS CODE, it will break existing databases
 * @param name
 * @returns
 */
const getFunctionName = (name: string) => {
  return `${name}_update_trigger_function`.replace(/-/g, '_');
};

/**
 * Get the name of the trigger function
 * DO NOT CHANGE THIS CODE, it will break existing databases
 * @param name
 * @returns
 */
const getTriggerName = (name: string) => {
  return `__SCHEMA___${name}_update_trigger`;
};

/**
 * Updates trigger function
 * @param table
 * @param triggers
 * @returns
 */
export const updateTriggerFunction = async (table: iTableEntity) => {
  const funcName = getFunctionName(table.name);

  const columns = await Promise.all(
    Object.keys(table.columns).map(async (key) => {
      const column = table.columns[key];
      if (column.kind === 'COMPUTED') return '';
      if (column.kind === 'RESOLVED') return '';
      if (!column?.onUpdate?.set) return '';
      const set = column?.onUpdate?.set;
      const value = typeof set === 'function' ? await set() : set;

      return `NEW.${key} = ${value};`;
    }),
  );

  if (columns.length === 0) return '';

  const beforeUpdate = table.beforeUpdate?.procedure
    ? `${table.beforeUpdate.procedure.trim().replace(/;$/, '')};\n`
    : '';

  // todo: after update

  const func = `
    CREATE OR REPLACE FUNCTION "__SCHEMA__".${funcName}() RETURNS TRIGGER AS $$
    BEGIN
      ${beforeUpdate}${columns.filter(Boolean).join('\n')}
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;

  return func;
};

/**
 * Creates a trigger function and attaches to the table
 * @param table
 * @param triggers
 * @returns
 */
export const createTrigger = async (table: iTableEntity, triggers: iTriggerChange[]): Promise<string[]> => {
  if (triggers.length === 0) return [];

  const funcName = getFunctionName(table.name);
  const triggerName = getTriggerName(table.name);

  const func = await updateTriggerFunction(table);
  const trigger = `
    CREATE TRIGGER "${triggerName}"
    BEFORE UPDATE ON "__SCHEMA__"."${table.name}"
    FOR EACH ROW
    EXECUTE FUNCTION "__SCHEMA__".${funcName}();
  `;

  return [func, trigger];
};

/**
 * Drops update trigger function and trigger from table
 * @param table
 * @returns
 */
export const dropTrigger = (table: iTableEntity) => {
  const funcName = getFunctionName(table.name);

  const triggerName = getTriggerName(table.name);
  return [
    `DROP TRIGGER IF EXISTS "${triggerName}" ON "__SCHEMA__"."${table.name}";`,
    `DROP FUNCTION IF EXISTS "__SCHEMA__".${funcName}() CASCADE;`,
  ];
};
