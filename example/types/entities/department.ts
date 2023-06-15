// ==========
// THIS IS AN AUTOMATICALLY GENERATED FILE
// To modify this type create a new type outside the "entities" directory and extend it
// ==========

/**
 * Type for the DepartmentsEntity entity
 */
export type DepartmentsEntity = {
  /**
   * ID of the department
   */
  id: string;

  name: string;

  description?: string;

  /**
   * ID of the departments lead
   */
  leadId?: string;

  createdAt: Date;

  updatedAt: Date;

  fruit: "alma" | "körte" | "barack";
};
