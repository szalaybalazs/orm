import { iMigration, iContext } from '../../src/types/migration';

class madeMessageNullableAndAddedReply_toMigration implements iMigration {
  id = 'madeMessageNullableAndAddedReply_to';

  timestamp = new Date('Thu, 20 Oct 2022 09:50:49 GMT');

  up = (ctx: iContext) => {
    return [
      `
        ALTER TABLE
          "${ctx.schema}"."comments"
        ADD COLUMN
          "reply_to" uuid NOT NULL,
        ALTER COLUMN
          "message"
        DROP NOT NULL;
      `,
    ];
  };

  down = (ctx: iContext) => {
    return [
      `
        ALTER TABLE
          "${ctx.schema}"."comments"
        DROP COLUMN
          "reply_to",
        ALTER COLUMN
          "message" NOT NULL;
      `,
    ];
  };
}

export default madeMessageNullableAndAddedReply_toMigration;
