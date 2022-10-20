import { iMigration, iContext } from '../../src/types/migration';

class addedSubtitleMigration implements iMigration {
  id = 'addedSubtitle';

  timestamp = new Date(1666206742000);

  up = (ctx: iContext) => {
    return [
      `
        ALTER TABLE
          "${ctx.schema}"."posts"
        ADD COLUMN
          "sub_title" varchar;
      `,
    ];
  };

  // TODO: generate revert SQL queries
  down = () => {
    return [];
  };
}

export default addedSubtitleMigration;
