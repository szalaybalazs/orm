import { tEntity } from "../../src/types/entity";

const reportingline: tEntity = {
  name: "reporting-line",
  columns: {
    id: { type: "uuid", nullable: true },
    subordinates: { type: "character varying", nullable: true },
  },
  resolver:
    ' WITH RECURSIVE "reporting-line"(id, subordinates) AS (\n         SELECT employees.id,\n            employees.full_name AS subordinates\n           FROM employees\n          WHERE employees.manager_id IS NULL\n        UNION ALL\n         SELECT e.id,\n            (rl.subordinates::text || \' > \'::text) || e.full_name::text AS subordinates\n           FROM employees e\n             JOIN "reporting-line" rl ON e.manager_id = rl.id\n        )\n SELECT "reporting-line".id,\n    "reporting-line".subordinates\n   FROM "reporting-line";',
};

export default reportingline;
