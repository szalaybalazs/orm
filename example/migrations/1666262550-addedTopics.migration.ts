import { iMigration, iContext } from '../../src/types/migration';

class addedTopicsMigration implements iMigration {
  id = 'addedTopics';

  timestamp = new Date('Thu, 20 Oct 2022 10:42:29 GMT');

  up = (ctx: iContext) => {
    return [
      `
        CREATE TABLE IF NOT EXISTS
          "${ctx.schema}"."topics" ("id" uuid NOT NULL PRIMARY KEY, "label" varchar NOT NULL);
      `,
      `
        ALTER TABLE
          "${ctx.schema}"."comments"
        DROP COLUMN
          "reply_to";
      `,
    ];
  };

  down = (ctx: iContext) => {
    return [
      `
        DROP TABLE IF EXISTS
          "${ctx.schema}"."topics" CASCADE;
      `,
      `
        ALTER TABLE
          "${ctx.schema}"."comments"
        ADD COLUMN
          "reply_to" uuid NOT NULL;
      `,
    ];
  };
}

export default addedTopicsMigration;
