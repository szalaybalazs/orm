import { iMigration, iContext } from '../../src/types/migration';

class addedSubtitleMigration implements iMigration {
  id: 'addedSubtitle';

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
