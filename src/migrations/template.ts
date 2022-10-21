import { format } from 'prettier';
import { format as formatSql } from 'sql-formatter';

const template = `import { iMigration, iContext } from '../../src/types/migration';

class __ID__Migration implements iMigration {
  id = '__ID__';
  name = '__NAME__';
  
  timestamp = __TIMESTAMP__;

  up = (ctx: iContext) => {
    return [__UP__];
  };

  down = (ctx: iContext) => {
    return [__DOWN__];
  };
};

export default __ID__Migration;
`;

const formatQuery = (queries: string[]): string => {
  const formatted = queries.map((sql) => formatSql(sql, { language: 'postgresql', expressionWidth: 120 }));

  const padding = formatted.map((l) => {
    return `\`\n${l.replace(/__SCHEMA__/g, '${ctx.schema}')}\n\``
      .split('\n')
      .map((l, i, arr) => `${createPadding(i < arr.length - 1 ? 8 : 6)}${l}`)
      .join('\n');
  });

  return padding.join(', ');
};

export const getMigrationTemplate = (id: string, name: string, up: string[], down: string[]) => {
  const upSql = formatQuery(up);
  const downSql = formatQuery(down);

  return format(
    template
      .replace(/__ID__/g, id)
      .replace(/__NAME__/g, name)
      .replace(/__TIMESTAMP__/g, `new Date('${new Date().toUTCString()}')`)
      .replace(/__UP__/g, upSql)
      .replace(/__DOWN__/g, downSql),
    {
      singleQuote: true,
      parser: 'babel',
      printWidth: 120,
      tabWidth: 2,
    },
  );
};

const createPadding = (length: number) => new Array(length || 1).fill(' ').join('');
