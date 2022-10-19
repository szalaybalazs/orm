import { iMigration, iContext } from '../../src/types/migration';

class addedPasswordMigration implements iMigration {
  id: 'addedPassword';

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
