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
    manager_id: {
      type: 'uuid',
      comment: 'ID of the employees manager',
      nullable: true,
      generated: false,
    },
    full_name: {
      type: 'varchar',
      comment: 'Name of the employee',
    },
    department_id: {
      type: 'uuid',
      comment: 'ID of the employees department',
      nullable: true,
      generated: false,
    },
  },
};

export default employee;
