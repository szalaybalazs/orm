/**
 * Return either a single or multiple SQL queries
 */
export type LifecycleFunction = (() => Promise<string>) | (() => string) | (() => Promise<string[]>) | (() => string[]);

export interface iMigration {
  id: string;

  /**
   * Return all the SQL queries necesarry to implement the changes
   */
  up: LifecycleFunction;

  /**
   * Reverts all the SQL queries necesarry to revert things made in "up" method
   */
  down?: LifecycleFunction;
}
