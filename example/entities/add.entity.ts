import { tEntity } from '../../src/types/entity';

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

export default add;
