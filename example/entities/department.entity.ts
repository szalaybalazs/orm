import { tEntity } from '../../src/types/entity';

const department: tEntity = {
  name: 'departments2',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the department',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      default: 'Unnamed department',
      nullable: false,
    },
    description: {
      type: 'varchar',
      nullable: true,
    },
    lead_id: {
      type: 'uuid',
      comment: 'ID of the departments lead',
      generated: false,
      nullable: true,
    },
    created_at: {
      type: 'timestamptz',
      default: 'now',
    },
  },
};

export default department;
