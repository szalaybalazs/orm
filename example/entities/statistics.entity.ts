import { tEntity } from '../../src/types/entity';

const reporting: tEntity = {
  name: 'statistics',
  type: 'VIEW',
  materialized: true,
  resolver: `
    SELECT
      name,
      employees,
      full_name AS lead
    FROM (
      SELECT
        department_id AS id,
        COUNT(1) AS employees
      FROM
        employees
      GROUP BY
        department_id) AS calc
      RIGHT JOIN departments USING (id)
      LEFT JOIN employees AS e ON e.id = lead_id
  `,
  columns: {
    name: 'varchar',
    employees: 'int',
    lead: 'varchar',
  },
};

export default reporting;
