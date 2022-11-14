import { tEntity } from "../../src/types/entity";

const department: tEntity = {
  name: "departments",
  columns: {
    id: { type: "uuid", primary: true, generated: true },
    name: { type: "character varying", default: "Unnamed department" },
    description: { type: "character varying", nullable: true },
    lead_id: { type: "uuid", nullable: true },
    created_at: { type: "timestamp with time zone", default: "now()" },
  },
  indices: [],
};

export default department;
