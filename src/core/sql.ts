import { format } from 'sql-formatter';
import { chalk } from './chalk';
import { debug } from './log';
import { prettier } from '../utils/formatter';

export const formatSql = (sql: string) => {
  try {
    return prettier(sql, {
      language: 'postgresql',
      expressionWidth: 60,
      keywordCase: 'upper',
    });
  } catch (error) {
    debug(chalk.dim('Failed to format SQL: '), error.message);
    return sql;
  }
};
