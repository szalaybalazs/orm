import { iMigration, iContext } from '../../src/types/migration';

class addedIndicesMigration implements iMigration {
  id = 'addedIndices';

  timestamp = new Date('Thu, 20 Oct 2022 13:49:47 GMT');

  up = (ctx: iContext) => {
    return [
      `
        CREATE INDEX
          "comments_user_id_idx" ON "${ctx.schema}"."comments" ("user_id")
      `,
      `
        CREATE INDEX
          "comments_post_id_user_id_idx" ON "${ctx.schema}"."comments" ("post_id") INCLUDE (user_id)
      `,
      `
        DROP INDEX
          IF EXISTS "${ctx.schema}"."users_username_password_idx" CASCADE
      `,
      `
        CREATE UNIQUE INDEX "users_username_password_idx" ON "${ctx.schema}"."users" ("username") INCLUDE (password)
      `,
    ];
  };

  down = (ctx: iContext) => {
    return [
      `
        DROP INDEX
          IF EXISTS "${ctx.schema}"."comments_user_id_idx" CASCADE
      `,
      `
        DROP INDEX
          IF EXISTS "${ctx.schema}"."comments_post_id_user_id_idx" CASCADE
      `,
      `
        DROP INDEX
          IF EXISTS "${ctx.schema}"."users_username_password_idx" CASCADE
      `,
      `
        CREATE INDEX
          "users_username_password_idx" ON "${ctx.schema}"."users" ("username") INCLUDE (password)
      `,
    ];
  };
}

export default addedIndicesMigration;
