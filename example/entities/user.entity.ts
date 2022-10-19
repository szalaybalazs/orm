import { tEntity } from '../../src/types/entity';

const user: tEntity = {
  name: 'users',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the user',
      primary: true,
    },
    firstname: {
      type: 'varchar',
      default: '',
    },
    lastname: {
      type: 'varchar',
      default: '',
    },
    name: {
      kind: 'RESOLVED',
      resolver: `TRIM(firstname || ' ' || lastname)`,
    },
  },
};

export default user;
