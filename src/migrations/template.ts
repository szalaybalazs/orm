import { format } from 'prettier';
import { format as formatSql } from 'sql-formatter';
import { prettier } from '../utils/formatter';

const typeImport = process.env.NODE_ENV === 'development' ? '../../src/types/migration' : 'undiorm/src/types';

const getTemplate = ({ id, name, timestamp, up, down }) => {
  return `import { iMigration, iContext } from '${typeImport}';

  class ${id}Migration implements iMigration {
    id = '${id}';
    name = '${name}';
    
    timestamp = ${timestamp};
  
    up = (ctx: iContext) => {
      return [${up}];
    };
  
    down = (ctx: iContext) => {
      return [${down}];
    };
  };
  
  export default ${id}Migration;
  `;
};

const formatQuery = (queries: string[]): string => {
  const formatted = queries.map((sql) =>
    formatSql(sql, {
      language: 'postgresql',
      expressionWidth: 60,
      keywordCase: 'upper',
    }),
  );

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
  const timestamp = `new Date('${new Date().toUTCString()}')`;

  const template = getTemplate({ id, name, timestamp, up: upSql, down: downSql });
  return prettier(String(template), {
    singleQuote: true,
    parser: 'babel',
    printWidth: 120,
    tabWidth: 2,
  });
};

const createPadding = (length: number) => new Array(length || 1).fill(' ').join('');
