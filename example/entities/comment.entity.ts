import { tEntity } from '../../src/types/entity';

const comment: tEntity = {
  name: 'comments',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the comment',
      primary: true,
    },
    message: {
      type: 'varchar',
    },
    user_id: {
      type: 'uuid',
      generated: false,
      comment: 'ID of the messages author',
    },
    post_id: {
      type: 'uuid',
      comment: 'ID of the post the message was sent under',
    },
  },
};

export default comment;
