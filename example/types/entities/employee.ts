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
  manager_id?: string;

  /**
   * ID of the employees department
   */
  department_id?: string;

  /**
   * Firstname of the employee
   */
  first_name: string;

  /**
   * Lastname of the employee
   */
  last_name: string;

  /**
   * Generated full name of the employee
   * can not be changed directly
   */
  full_name: string;

  is_suspended: boolean;

  joined_at: Date;

  time_since_join: number;
};
