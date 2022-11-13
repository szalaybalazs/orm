// ==========
// THIS IS AN AUTOMATICALLY GENERATED FILE
// To modify this type create a new type outside the "entities" directory and extend it
// ==========

/**
 * Type for the UsersEntity entity
 */
export type UsersEntity = {
  /**
   * ID of the user
   */
  id: string;

  /**
   * Email of the user
   */
  email: string;

  /**
   * Firstname of the user
   */
  first_name: string;

  /**
   * Lastname of the user
   */
  last_name: string;

  /**
   * Generated full name of the user can not be changed directly
   */
  full_name: string;

  is_suspended: boolean;

  joined_at: Date;

  time_since_join: number;
};
