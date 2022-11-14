import { tEntity } from "../../src/types/entity";

const reportingline: tEntity = {
  name: "reporting-line",
  columns: {
    id: { type: "uuid", nullable: true },
    subordinates: { type: "character varying", nullable: true },
  },
  resolver: `
WITH RECURSIVE
  "reporting-line" (id, subordinates) AS (
    SELECT
      employees.id,
      employees.full_name AS subordinates
    FROM
      employees
    WHERE
      employees.manager_id IS NULL
    UNION ALL
    SELECT
      e.id,
      (rl.subordinates::TEXT || ' > '::TEXT) || e.full_name::TEXT AS subordinates
    FROM
      employees e
      JOIN "reporting-line" rl ON e.manager_id = rl.id
  )
SELECT
  "reporting-line".id,
  "reporting-line".subordinates
FROM
  "reporting-line";
`,
};

export default reportingline;
