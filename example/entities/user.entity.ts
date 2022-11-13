import { tEntity } from '../../src/types';

const user: tEntity = {
  name: 'users',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the user',
      primary: true,
      generated: true,
    },
    email: {
      type: 'varchar',
      comment: 'Email of the user',
    },
    first_name: {
      type: 'varchar',
      comment: 'Firstname of the user',
    },
    last_name: {
      type: 'varchar',
      comment: 'Lastname of the user',
    },
    full_name: {
      kind: 'COMPUTED',
      type: 'varchar',
      resolver: "TRIM(first_name || ' ' || last_name)",
      comment: 'Generated full name of the user can not be changed directly',
    },
    is_suspended: {
      type: 'boolean',
      default: false,
    },
    joined_at: {
      type: 'timestamp with time zone',
      default: 'now',
    },
    time_since_join: {
      kind: 'RESOLVED',
      resolver: '(EXTRACT(epoch FROM now() - joined_at) / 3600)::int',
      type: 'int',
    },
  },
  indices: [
    {
      columns: ['id'],
      unique: true,
    },
    {
      columns: ['email'],
      unique: true,
    },
  ],
};

export default user;
