import { iMigration, iContext } from '../../src/types/migration';

class changedAttachmentPrimaryKeyToCompundKeyMigration implements iMigration {
  id = 'changedAttachmentPrimaryKeyToCompundKey';

  timestamp = new Date('Thu, 20 Oct 2022 16:05:05 GMT');

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
          PRIMARY KEY ("id", "key");
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
          PRIMARY KEY ("key");
      `,
    ];
  };
}

export default changedAttachmentPrimaryKeyToCompundKeyMigration;
