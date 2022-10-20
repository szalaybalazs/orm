import { tEntity } from '../../src/types/entity';

const user: tEntity = {
  name: 'users',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the user',
      primary: true,
      generated: true,
    },
    firstname: {
      type: 'varchar',
      default: 'John',
    },
    lastname: {
      type: 'varchar',
      default: 'Doe',
    },
    name: {
      kind: 'RESOLVED',
      resolver: `TRIM(firstname || ' ' || lastname)`,
    },
    username: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
    },
  },
  indices: [{ columns: ['username'], includes: ['password'], unique: true }],
};

export default user;
