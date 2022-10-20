import { tEntity } from '../../src/types/entity';

const attachment: tEntity = {
  name: 'attachments',
  columns: {
    id: {
      type: 'uuid',
      comment: 'ID of the attachment',
      primary: true,
    },
    key: {
      type: 'varchar',
      comment: 'Attachment key on S3',
    },
  },
};

export default attachment;
