import { tEntity } from "../../src/types/entity";

const employee: tEntity = {
  name: "employees",
  columns: {
    id: { type: "uuid", generated: true },
    manager_id: { type: "uuid", nullable: true },
    department_id: { type: "uuid", nullable: true },
    first_name: { type: "character varying" },
    last_name: { type: "character varying" },
    is_suspended: { type: "boolean", default: true },
    joined_at: { type: "timestamp with time zone", default: "now()" },
    full_name: { type: "character varying", nullable: true },
  },
};

export default employee;
