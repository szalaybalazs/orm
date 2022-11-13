import { tEntity } from '../../src/types/entity';

const test: tEntity = {
  name: 'tests',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: true,
    },
  },
};

export default test;
