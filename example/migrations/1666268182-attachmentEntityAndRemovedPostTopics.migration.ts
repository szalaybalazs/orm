import { iMigration, iContext } from '../../src/types/migration';

class attachmentEntityAndRemovedPostTopicsMigration implements iMigration {
  id = 'attachmentEntityAndRemovedPostTopics';

  timestamp = new Date('Thu, 20 Oct 2022 12:16:21 GMT');

  up = (ctx: iContext) => {
    return [
      `
        DROP TABLE IF EXISTS
          "${ctx.schema}"."topics" CASCADE;
      `,
      `
        CREATE TABLE IF NOT EXISTS
          "${ctx.schema}"."attachments" ("id" uuid NOT NULL PRIMARY KEY, "key" varchar NOT NULL);
      `,
      `
        ALTER TABLE
          "${ctx.schema}"."comments"
        ADD COLUMN
          "reply_to" uuid NOT NULL DEFAULT uuid_generate_v4 ();
      `,
    ];
  };

  down = (ctx: iContext) => {
    return [
      `
        CREATE TABLE IF NOT EXISTS
          "${ctx.schema}"."topics" ("id" uuid NOT NULL PRIMARY KEY, "label" varchar NOT NULL);
      `,
      `
        DROP TABLE IF EXISTS
          "${ctx.schema}"."attachments" CASCADE;
      `,
      `
        ALTER TABLE
          "${ctx.schema}"."comments"
        DROP COLUMN
          "reply_to";
      `,
    ];
  };
}

export default attachmentEntityAndRemovedPostTopicsMigration;
