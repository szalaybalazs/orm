export interface iContext {
  schema: string;
}

/**
 * Return either a single or multiple SQL queries
 */
export type LifecycleFunction =
  | ((ctx: iContext) => Promise<string>)
  | ((ctx: iContext) => string)
  | ((ctx: iContext) => Promise<string[]>)
  | ((ctx: iContext) => string[]);

export interface iMigration {
  /**
   * ID of the migration - should be unique
   */
  id: string;

  /**
   * Date of generation
   */
  timestamp: Date;

  /**
   * Return all the SQL queries necesarry to implement the changes
   */
  up: LifecycleFunction;

  /**
   * Reverts all the SQL queries necesarry to revert things made in "up" method
   */
  down?: LifecycleFunction;
}
