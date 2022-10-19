import { iMigration, iContext } from '../../src/types/migration';

class addedPasswordToUserMigration implements iMigration {
  id: 'addedPasswordToUser';

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
  down = () => {
    return [];
  };
}

export default addedPasswordToUserMigration;
