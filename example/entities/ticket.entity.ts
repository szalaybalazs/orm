import { tEntity } from '../../src/types/entity';

const ticket: tEntity = {
  name: 'tickets',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the ticket',
      primary: true,
      generated: true,
    },
    title: {
      type: 'varchar',
      default: 'Unnamed ticket',
    },
    content: {
      type: 'varchar',
      nullable: true,
    },
    author_id: {
      type: 'uuid',
      comment: 'ID of the tickets author',
      generated: false,
      nullable: true,
    },
    created_at: {
      type: 'timestamptz',
      default: 'now',
    },
    is_deleted: {
      type: 'boolean',
      default: false,
    },
  },
};

export default ticket;
