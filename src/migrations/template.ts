import { format } from 'prettier';
import { format as formatSql } from 'sql-formatter';

const template = `import { iMigration, iContext } from '../../src/types/migration';

class __ID__Migration implements iMigration {
  id: '__ID__';

  up = (ctx: iContext) => {
    return [__UP__];
  };

  // TODO: generate revert SQL queries
  down = () => {
    return [];
  };
};

export default __ID__Migration;
`;

export const getMigrationTemplate = (id: string, up: string[]) => {
  const upSql = up
    .map((sql) => formatSql(sql))
    .map((l) =>
      `\`\n${l.replace(/__SCHEMA__/, '${ctx.schema}')}\n\``
        .split('\n')
        .map((l, i, arr) => `${createPadding(i < arr.length - 1 ? 8 : 6)}${l}`)
        .join('\n'),
    )
    .join(', ');

  return format(template.replace(/__ID__/g, id).replace(/__UP__/g, upSql), {
    singleQuote: true,
    parser: 'babel',
    printWidth: 120,
    tabWidth: 2,
  });
};

const createPadding = (length: number) => new Array(length || 1).fill(' ').join('');
