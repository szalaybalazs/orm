import { tEntity } from '../../src/types/entity';

const reporting: tEntity = {
  name: 'reporting-line',
  type: 'VIEW',
  resolver: `
    SELECT
      employee_id,
      full_name AS subordinates
    FROM
      employees
    WHERE
      manager_id IS NULL
    UNION ALL
      SELECT
        e.employee_id,
        (
          rl.subordinates || ' > ' || e.full_name
        ) AS subordinates
      FROM
        employees e
      INNER JOIN reporting_line rl ON e.manager_id = rl.employee_id
  `,
  rercursiveResolver: `
    SELECT
      employee_id,
      subordinates
    FROM
      reporting_line
    ORDER BY
      employee_id;
  `,
  columns: {
    hour: 'timestamptz',
    count: 'int',
  },
};

export default reporting;
