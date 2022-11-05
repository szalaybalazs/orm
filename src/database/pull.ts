import { isPlural, singular } from 'pluralize';
import { createPostgresConnection } from '../drivers/pg';
import { iVerboseConfig, tEntity } from '../types';

// todo: handle materialized views
/**
 * Get current the schema of the database
 * @param options connection options
 * @returns entity map
 */
export const pullSchema = async (options: iVerboseConfig): Promise<{ [key: string]: tEntity }> => {
  const schema = 'public';
  const migrationsTable = options.migrationsTable || '__migrations__';
  const { query, close } = createPostgresConnection(options);
  try {
    const [allColumns, allTables] = await Promise.all([
      query(`
        SELECT * FROM information_schema.columns
        WHERE table_schema = '${schema}'
        ORDER BY ordinal_position ASC
      `),
      query(`
        SELECT * FROM information_schema.tables
        LEFT JOIN pg_get_viewdef(table_name, true) AS viewdef ON TRUE
        WHERE table_schema = '${schema}'
      `),
    ]);

    const tables = Array.from(new Set(allColumns.map((c) => c.table_name))).filter((t) => t !== migrationsTable);

    const entities = tables.map((table) => {
      const key = isPlural(table) ? singular(table) : table;

      const tableConfig = allTables.find((t) => t.table_name === table);

      const cols = allColumns.filter((col) => col.table_name === table);

      const columns = cols.reduce((acc, col) => {
        const column: any = {
          type: col.data_type,
        };

        if (col.column_default) {
          if (column.type === 'uuid') column.generated = true;
          else {
            let _default: string = col.column_default.split('::')[0];
            if (_default.startsWith("'")) _default = _default.replace(/'/g, '');

            if (column.type === 'boolean') column.default = Boolean(_default);
            else column.default = _default;
          }
        }
        if (col.is_nullable === 'YES') column.nullable = true;

        acc[col.column_name] = column;
        return acc;
      }, {});

      const entity: any = {
        key,
        name: table,
        columns,
      };

      if (tableConfig.viewdef) entity.resolver = tableConfig.viewdef;

      return entity;
    });

    return entities.reduce((acc, entity) => ({ ...acc, [entity.key]: entity }), {});
  } catch (error) {
    throw error;
  } finally {
    await close();
  }
};
