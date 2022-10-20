import { iMigration, iContext } from '../../src/types/migration';

class changedAttachmentPrimaryKeyMigration implements iMigration {
  id = 'changedAttachmentPrimaryKey';

  timestamp = new Date('Thu, 20 Oct 2022 16:04:15 GMT');

  up = (ctx: iContext) => {
    return [
      `
        ALTER TABLE
          "${ctx.schema}"."attachments"
        DROP
          CONSTRAINT "attachments_pkey";
      `,
      `
        ALTER TABLE
          "${ctx.schema}".attachments
        ADD
          PRIMARY KEY ("key");
      `,
    ];
  };

  down = (ctx: iContext) => {
    return [
      `
        ALTER TABLE
          "${ctx.schema}"."attachments"
        DROP
          CONSTRAINT "attachments_pkey";
      `,
      `
        ALTER TABLE
          "${ctx.schema}".attachments
        ADD
          PRIMARY KEY ("id");
      `,
    ];
  };
}

export default changedAttachmentPrimaryKeyMigration;
