import { getProcedure, getUpdaters } from '../migrations/changes/trigger';
import { iTableEntity } from '../types';
import { eTriggerType } from '../types/column';
import { iProcedure } from '../types/entity';

/**
 * Get the name of the trigger function
 * DO NOT CHANGE THIS CODE, it will break existing databases
 * @param name
 * @returns
 */
const getFunctionName = (name: string, action: eTriggerType = 'UPDATE') => {
  return `${name}_${action.toLowerCase()}_trigger_function`.replace(/-/g, '_');
};

/**
 * Get the name of the trigger function
 * DO NOT CHANGE THIS CODE, it will break existing databases
 * @param name
 * @returns
 */
const getTriggerName = (name: string, action: eTriggerType = 'UPDATE') => {
  return `__SCHEMA___${name}_${action?.toLowerCase()}_trigger`;
};

const formatProcedure = (procedure: iProcedure) => {
  if (!procedure?.procedure) return null;
  return `${procedure.procedure.trim().replace(/;$/, '')};`;
};

/**
 * Updates trigger function
 * @param table
 * @param triggers
 * @returns
 */
export const updateTriggerFunction = async (
  table: iTableEntity,
  kind: eTriggerType = 'UPDATE',
): Promise<string | null> => {
  const funcName = getFunctionName(table.name, kind);

  const updaters = getUpdaters(table, kind);
  const columns = await Promise.all(
    updaters.map(async ({ key, updater }) => {
      const set = updater?.set;
      const value = typeof set === 'function' ? await set() : set;
      if (!value) return undefined;

      return `NEW.${key} = ${value};`;
    }),
  );

  const procedure = formatProcedure(getProcedure(table, kind));

  if (columns.length === 0 && !procedure) return null;

  return `
    CREATE OR REPLACE FUNCTION "__SCHEMA__".${funcName}() RETURNS TRIGGER AS $$
    BEGIN
        ${[procedure, ...columns].filter(Boolean).join('\n        ')}
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;
};

const getTrigger = (type: eTriggerType) => {
  if (type === 'DELETE') return 'DELETE';
  if (type === 'UPDATE') return 'UPDATE';
  return 'INSERT';
};

/**
 * Creates a trigger function and attaches to the table
 * @param table
 * @param triggers
 * @returns
 */
export const createTrigger = async (table: iTableEntity, kind: eTriggerType = 'UPDATE'): Promise<string[]> => {
  const funcName = getFunctionName(table.name, kind);
  const triggerName = getTriggerName(table.name, kind);

  const func = await updateTriggerFunction(table, kind);
  if (!func) return [];

  const trigger = `
    CREATE TRIGGER "${triggerName}"
    BEFORE ${getTrigger(kind)} ON "__SCHEMA__"."${table.name}"
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
export const dropTrigger = (table: iTableEntity, kind: eTriggerType = 'UPDATE') => {
  const funcName = getFunctionName(table.name, kind);

  const triggerName = getTriggerName(table.name, kind);
  return [
    `DROP TRIGGER IF EXISTS "${triggerName}" ON "__SCHEMA__"."${table.name}";`,
    `DROP FUNCTION IF EXISTS "__SCHEMA__".${funcName}() CASCADE;`,
  ];
};
