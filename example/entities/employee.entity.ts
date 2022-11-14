import { tEntity } from "../../src/types/entity";

const employee: tEntity = {
  name: "employees",
  columns: {
    id: { type: "uuid", primary: true, generated: true },
    email: { type: "character varying" },
    manager_id: { type: "uuid", nullable: true },
    department_id: { type: "uuid", nullable: true },
    first_name: { type: "character varying" },
    last_name: { type: "character varying" },
    full_name: { type: "character varying", nullable: true },
    is_suspended: { type: "boolean", default: true },
    joined_at: { type: "timestamp with time zone", default: "now()" },
  },
  indices: [
    { columns: ["email"], unique: true, method: "btree" },
    { columns: ["first_name", "last_name"], method: "btree" },
  ],
};

export default employee;
