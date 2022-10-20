import { tEntity } from '../../src/types/entity';

const topic: tEntity = {
  name: 'topics',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the topic',
      primary: true,
    },
    label: {
      type: 'varchar',
    },
  },
};

export default topic;
