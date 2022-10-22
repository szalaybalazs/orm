/**
 * Generate query from multiple command
 * @param commands list of optional commands
 * @returns SQL Query
 */
export const getQuery = (...commands: (string | undefined | boolean | null)[]) => {
  return commands.filter(Boolean).join(' ');
};
