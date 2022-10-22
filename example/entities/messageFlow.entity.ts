import { tEntity } from '../../src/types/entity';

const flow: tEntity = {
  name: 'message-flow',
  type: 'VIEW',
  resolver: `
    SELECT DATE_TRUNC('hour', created_at) AS "hour", COUNT(1)
    FROM posts
    GROUP BY DATE_TRUNC('hour', created_at)
  `,
  columns: {
    hour: 'timestamptz',
    count: 'int',
  },
};

export default flow;
