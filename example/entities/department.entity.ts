import { tEntity } from '../../src/types/entity';

const department: tEntity = {
  name: 'departments',
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
      type: 'uuid',
      nullable: true,
    },
    lead_id: {
      type: 'uuid',
      comment: 'ID of the departments lead',
      generated: false,
      nullable: true,
      reference: {
        table: 'employees',
        column: 'id',
      },
    },
    created_at: {
      type: 'timestamptz',
      default: 'now',
    },

    updatedAt: {
      type: 'timestamptz',
      default: 'now',
      // onUpdate: {
      //   set: 'CURRENT_TIMESTAMP',
      // },
    },
    fruit: {
      type: 'enum',
      enum: ['alma', 'körte', 'barack', 'citrom'],
      default: 'alma',
      enumName: 'fruit',
    },
  },
};

export default department;
