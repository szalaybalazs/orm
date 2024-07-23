/**
 * Generate query from multiple command
 * @param commands list of optional commands
 * @returns SQL Query
 */
export declare const getQuery: (...commands: (string | undefined | boolean | null)[]) => string;
