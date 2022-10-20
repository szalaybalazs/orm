import { iMigration, iContext } from '../../src/types/migration';

class createdCommentsAndSwitchedFromEmailToUsernameMigration implements iMigration {
  id = 'createdCommentsAndSwitchedFromEmailToUsername';

  timestamp = new Date('Thu, 20 Oct 2022 09:44:32 GMT');

  up = (ctx: iContext) => {
    return [
      `
        CREATE TABLE IF NOT EXISTS
          "${ctx.schema}"."comments" ("id" uuid NOT NULL PRIMARY KEY, "message" varchar NOT NULL, "user_id" uuid NOT NULL, "post_id" uuid NOT NULL);
      `,
      `
        ALTER TABLE
          "${ctx.schema}"."users"
        ADD COLUMN
          "username" varchar NOT NULL UNIQUE,
        DROP COLUMN
          "email";
      `,
    ];
  };

  down = (ctx: iContext) => {
    return [
      `
        DROP TABLE IF EXISTS
          "${ctx.schema}"."comments" CASCADE;
      `,
      `
        ALTER TABLE
          "${ctx.schema}"."users"
        DROP COLUMN
          "username",
        ADD COLUMN
          "email" varchar NOT NULL UNIQUE;
      `,
    ];
  };
}

export default createdCommentsAndSwitchedFromEmailToUsernameMigration;
