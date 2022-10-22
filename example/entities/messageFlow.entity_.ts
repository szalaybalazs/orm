import { tEntity } from '../../src/types/entity';

const flow: tEntity = {
  name: 'message-flow',
  type: 'VIEW',
  resolver: '',
  columns: {},
  // columns: {
  //   id: {
  //     type: 'uuid',
  //     comment: 'ID of the comment',
  //     primary: true,
  //   },
  //   message: {
  //     type: 'varchar',
  //     nullable: true,
  //   },
  //   reply_to: {
  //     type: 'uuid',
  //     generated: true,
  //   },
  //   user_id: {
  //     type: 'uuid',
  //     generated: false,
  //     comment: 'ID of the messages author',
  //   },
  //   post_id: {
  //     type: 'uuid',
  //     comment: 'ID of the post the message was sent under',
  //   },
  // },
};

export default flow;
