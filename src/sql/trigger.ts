// `
//         CREATE OR REPLACE FUNCTION "${ctx.schema}".user_snapshot_function() RETURNS TRIGGER AS $$
//         BEGIN
//             NEW.updated_at = NOW();
//             INSERT INTO "${ctx.schema}"."user-snapshot"
//             SELECT OLD.*;
//             RETURN NEW;
//         END;
//         $$ LANGUAGE plpgsql;

import { iTableEntity } from '../types';
import { iTriggerChange } from '../types/changes';

//         CREATE TRIGGER "${ctx.schema}_user_snapshot_trigger"
//         BEFORE UPDATE ON "${ctx.schema}"."user"
//         FOR EACH ROW
//         EXECUTE FUNCTION "${ctx.schema}".user_snapshot_function();
//       `,

const getFunctionName = (name: string) => {
  return `${name}_update_trigger_function`.replace(/-/g, '_');
};

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

  const func = `
    CREATE OR REPLACE FUNCTION "__SCHEMA__".${funcName}() RETURNS TRIGGER AS $$
    BEGIN
      ${columns.filter(Boolean)}
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
