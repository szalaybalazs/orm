import { tEntity } from '../../src/types/entity';

const employee: tEntity = {
  name: 'employees',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the employee',
      primary: true,
      generated: true,
    },
    email: {
      type: 'varchar',
      comment: 'Email of the user',
    },
    manager_id: {
      type: 'uuid',
      comment: 'ID of the employees manager',
      nullable: true,
      generated: false,
    },
    department_id: {
      type: 'uuid',
      comment: 'ID of the employees department',
      nullable: true,
      generated: false,
      reference: {
        table: 'departments',
        column: 'id',
        onDelete: 'NULL',
      },
    },
    first_name: {
      type: 'varchar',
      comment: 'Firstname of the employee',
    },
    last_name: {
      type: 'varchar',
      comment: 'Lastname of the employee',
    },
    full_name: {
      kind: 'COMPUTED',
      type: 'varchar',
      resolver: "TRIM(first_name || ' ' || last_name)",
      comment: 'Generated full name of the employee\ncan not be changed directly',
    },
    is_suspended: {
      type: 'boolean',
      default: false,
      nullable: true,
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
    gender: {
      type: 'enum',
      enum: ['MALE', 'FEMALE', 'OTHER'],
    },
  },
  indices: [
    {
      columns: ['id'],
      unique: true,
    },
    {
      columns: ['email'],
      includes: ['id'],
      unique: true,
    },
    {
      columns: ['first_name', 'last_name'],
      includes: ['id'],
    },
  ],
};

export default employee;
