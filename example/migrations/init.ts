import { iMigration } from '../../src/types/migration';

class InitMigration implements iMigration {
  id: 'init-202210191750';

  up = () => {
    return [
      `
        CREATE TABLE IF NOT EXISTS public.user (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          firstname VARCHAR NOT NULL,
          lastname VARCHAR NOT NULL
        );
      `,
    ];
  };

  down = () => {
    return [
      `
        DROP TABLE public.users;
      `,
    ];
  };
}

export default InitMigration;
