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
    title: {
      type: 'varchar',
      default: 'Unnamed post',
      nullable: false,
    },
    sub_title: {
      type: 'varchar',
      nullable: true,
    },
    author_id: {
      type: 'uuid',
      comment: 'ID of the posts author',
    },
  },
};

export default post;
