import { format } from 'sql-formatter';
import { chalk } from './chalk';
import { debug } from './log';

export const formatSql = (sql: string) => {
  try {
    return format(sql, {
      language: 'postgresql',
      expressionWidth: 60,
      keywordCase: 'upper',
    });
  } catch (error) {
    debug(chalk.dim('Failed to format SQL: '), error.message);
    return sql;
  }
};
