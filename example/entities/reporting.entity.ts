import { tEntity } from '../../src/types/entity';

const reporting: tEntity = {
  name: 'reporting-line',
  type: 'VIEW',
  resolver: (name: string) => {
    return `
      SELECT
        id,
        full_name AS subordinates
      FROM
        employees
      WHERE
        manager_id IS NULL
      UNION ALL
        SELECT
          e.id,
          (
            rl.subordinates || ' > ' || e.full_name
          ) AS subordinates
        FROM
          employees e
        INNER JOIN "${name}" rl ON e.manager_id = rl.id
    `;
  },
  columns: {
    id: 'uuid',
    subordinates: 'varchar',
  },
};

export default reporting;
