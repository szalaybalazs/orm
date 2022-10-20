import { format } from 'prettier';
import { format as formatSql } from 'sql-formatter';

const template = `import { iMigration, iContext } from '../../src/types/migration';

class __ID__Migration implements iMigration {
  id = '__ID__';
  
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

export const getMigrationTemplate = (id: string, up: string[], down: string[]) => {
  const upSql = up
    .map((sql) => formatSql(sql, { language: 'postgresql', expressionWidth: 120 }))
    .map((l) =>
      `\`\n${l.replace(/__SCHEMA__/g, '${ctx.schema}')}\n\``
        .split('\n')
        .map((l, i, arr) => `${createPadding(i < arr.length - 1 ? 8 : 6)}${l}`)
        .join('\n'),
    )
    .join(', ');
  const downSql = down
    .map((sql) => formatSql(sql, { language: 'postgresql', expressionWidth: 120 }))
    .map((l) =>
      `\`\n${l.replace(/__SCHEMA__/g, '${ctx.schema}')}\n\``
        .split('\n')
        .map((l, i, arr) => `${createPadding(i < arr.length - 1 ? 8 : 6)}${l}`)
        .join('\n'),
    )
    .join(', ');

  return format(
    template
      .replace(/__ID__/g, id)
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
