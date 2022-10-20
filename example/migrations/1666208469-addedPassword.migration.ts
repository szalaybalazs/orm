import { iMigration, iContext } from '../../src/types/migration';

class addedPasswordMigration implements iMigration {
  id = 'addedPassword';

  timestamp = new Date(1666208469000);

  up = (ctx: iContext) => {
    return [
      `
        ALTER TABLE
          "${ctx.schema}"."users"
        ADD COLUMN
          "password" varchar NOT NULL;
      `,
    ];
  };

  // TODO: generate revert SQL queries
  down = (ctx: iContext) => {
    return [
      `
        ALTER TABLE
          "${ctx.schema}"."users"
        DROP COLUMN
          "password";
      `,
    ];
  };
}

export default addedPasswordMigration;
