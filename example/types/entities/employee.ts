// ==========
// THIS IS AN AUTOMATICALLY GENERATED FILE
// To modify this type create a new type outside the "entities" directory and extend it
// ==========

/**
 * Type for the EmployeesEntity entity
 */
export type EmployeesEntity = {
  /**
   * ID of the employee
   */
  id: string;

  /**
   * Email of the user
   */
  email: string;

  /**
   * ID of the employees manager
   */
  managerId?: string;

  /**
   * ID of the employees department
   */
  departmentId?: string;

  /**
   * Firstname of the employee
   */
  firstName: string;

  /**
   * Lastname of the employee
   */
  lastName: string;

  /**
   * Generated full name of the employee
   * can not be changed directly
   */
  fullName: string;

  isSuspended?: boolean;

  joinedAt: Date;

  timeSinceJoin: number;

  gender: "MALE" | "FEMALE" | "OTHER";

  updatedAt: Date;

  lastUpdate: Date;

  fruit: "alma" | "körte" | "barack";
};
