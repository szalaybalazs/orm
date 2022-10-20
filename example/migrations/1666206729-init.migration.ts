import { iMigration, iContext } from '../../src/types/migration';

class initMigration implements iMigration {
  id = 'init';

  timestamp = new Date(1666206729000);

  up = (ctx: iContext) => {
    return [
      `
        CREATE TABLE
          IF NOT EXISTS "${ctx.schema}"."posts" (
            "id" uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
            "title" varchar NOT NULL DEFAULT 'Unnamed post',
            "author_id" uuid NOT NULL
          );
      `,
      `
        CREATE TABLE
          IF NOT EXISTS "${ctx.schema}"."users" (
            "id" uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
            "firstname" varchar NOT NULL DEFAULT 'John',
            "lastname" varchar NOT NULL DEFAULT 'Doe',
            "name" undefined NOT NULL,
            "email" varchar NOT NULL UNIQUE
          );
      `,
    ];
  };

  // TODO: generate revert SQL queries
  down = () => {
    return [];
  };
}

export default initMigration;
