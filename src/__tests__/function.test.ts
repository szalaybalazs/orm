import { describe, test } from '@jest/globals';
import { createFunction, dropFunction } from '../sql/function';

import { tEntity } from '../types';

const add: tEntity = {
  name: 'add_sql',
  type: 'FUNCTION',
  returns: 'int',
  immutable: true,
  nullBehaviour: 'RETURNS_NULL',
  args: { a: 'int', b: 'int' },
  variables: { sum: 'int' },
  body: `SELECT a + b INTO sum`,
  return: 'sum',
};

describe('Functions', () => {
  // test('Generate SQL migration', async () => {
  //   const entities = await loadEntities('./example/entities');
  //   const tables = getEntities(entities);
  //   const queries = await generateQueries(changes, tables, {});

  //   console.log(queries);
  // });

  test('Generate function sql', async () => {
    const sql = createFunction(add);

    console.log(sql);
  });
  test('Drop function sql', async () => {
    const sql = dropFunction(add);

    console.log(sql);
  });
});
