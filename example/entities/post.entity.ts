import { tEntity } from '../../src/types/entity';

const post: tEntity = {
  name: 'posts',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the post',
      primary: true,
      generated: true,
    },
    author_id: {
      type: 'uuid',
      comment: 'ID of the posts author',
    },
  },
};

export default post;
