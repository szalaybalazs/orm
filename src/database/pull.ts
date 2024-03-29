import { isPlural, singular } from 'pluralize';
import { convertKey } from '../core/naming';
import { createPostgresConnection } from '../drivers/pg';
import { iIndex, iVerboseConfig, tEntity } from '../types';
import { NumberTypes } from '../types/datatypes';

// todo: handle materialized views
// todo: handle foreign keys
// todo: fix view resolver query
/**
 * Get current the schema of the database
 * @param options connection options
 * @returns entity map
 */
export const pullSchema = async (options: iVerboseConfig): Promise<{ [key: string]: tEntity }> => {
  const schema = options.schema || 'public';
  const migrationsTable = options.migrationsTable || '__migrations__';
  const { query, close } = createPostgresConnection(options);
  try {
    const [allColumns, allTables, primaryKeys, indexDefinitions, enumValues] = await Promise.all([
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
      query(`
        SELECT 
          a.attname AS column_name, 
          format_type(a.atttypid, a.atttypmod) AS data_type, 
          indrelid::regclass::text AS table_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indisprimary;
      `),
      query(`
        SELECT tablename, indexname, indexdef, schemaname
        FROM pg_indexes
        WHERE schemaname NOT IN ('pg_catalog')
        ORDER BY tablename, indexname;
      `),
      query(`
        SELECT *
        FROM pg_type
        RIGHT JOIN pg_enum
        ON pg_type.oid = enumtypid
        WHERE typcategory = 'E';
      `),
    ]);

    const enums = enumValues.reduce((acc, { typname, enumlabel }) => {
      if (!(typname in acc)) acc[typname] = [];
      acc[typname].push(enumlabel);
      return acc;
    }, {});
    const tables = Array.from(new Set(allColumns.map((c) => c.table_name))).filter((t) => t !== migrationsTable);

    const entities = tables.map((table) => {
      const key = isPlural(table) ? singular(table) : table;

      const tableConfig = allTables.find((t) => t.table_name === table);

      const cols = allColumns.filter((col) => col.table_name === table);

      const columns = cols.reduce((acc, col) => {
        const column: any = {
          type: col.udt_name || col.data_type,
        };

        if (column.type in enums) {
          column.enum = enums[column.type];
          column.type = 'enum';
        }

        const isPrimary = !!primaryKeys.find((f) => f.column_name === col.column_name && f.table_name === table);
        if (isPrimary) column.primary = true;

        if (column.type.startsWith('_')) {
          column.type = column.type.replace(/^_/, '');
          column.array = true;
        }
        if (col.column_default) {
          if (column.type === 'uuid') column.generated = true;
          else {
            let _default: string = col.column_default.split('::')[0];
            if (_default.startsWith("'")) _default = _default.replace(/'/g, '');

            if (['boolean', 'bool'].includes(column.type)) column.default = Boolean(_default);
            else if (NumberTypes.includes(column.type)) column.default = Number(_default);
            else if (_default.toLowerCase() !== 'null') column.default = _default;
          }
        }
        if (col.is_nullable === 'YES') column.nullable = true;

        acc[convertKey(col.column_name, options.namingConvention)] = column;
        return acc;
      }, {});

      const entity: any = {
        key,
        name: table,
        columns,
      };

      const indices = indexDefinitions.filter((i) => i.tablename === table);
      if (indices.length) {
        const allIndices = indices.map((i) => parseIndexDefinition(i.indexdef));
        entity.indices = allIndices.filter((i) => !i?.name?.endsWith('_pkey'));
      }

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

export const parseIndexDefinition = (definition: string) => {
  // CREATE INDEX employees_first_name_last_name_id_idx ON public.employees USING btree (first_name, last_name) INCLUDE (id)

  const words = definition.replace(/\s\s+/g, ' ').split(' ').filter(Boolean);

  const isUnique = words[1].toLowerCase() === 'unique';
  const name = words[isUnique ? 3 : 2].replace(/"/g, '');

  const usingIndex = words.findIndex((w) => w.toLowerCase() === 'using');
  const method = usingIndex > -1 ? words[usingIndex + 1] : undefined;

  const matches = Array.from(definition.matchAll(/(INCLUDE\s+)?\((.*?)\)/gi));

  const columnMatch = matches.find((m) => !m[1])?.[2];
  const columns = columnMatch?.split(',').map((w) => w.trim());

  const includeMatch = matches.find((m) => m[1]?.toLowerCase()?.includes?.('includes'))?.[2];
  const includes = includeMatch?.split(',').map((w) => w.trim());

  const index: iIndex = {
    columns,
  };

  if (includes?.length) index.includes = includes;
  if (isUnique) index.unique = true;
  if (method) index.method = method as any;
  if (!name.includes(columns.join('_'))) index.name = name;

  return index;
};
