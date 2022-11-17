export const getViewResolver = (
  name: string,
  resolver: string | ((name: string) => string) = '',
): { query: string; isRecursive: boolean } => {
  const sql = typeof resolver === 'string' ? resolver : resolver(name);
  const query = sql.replace(/__NAME__/g, `"${name}"`).replace(/\\n/g, '\n');

  return {
    query,
    isRecursive: query.includes(name),
  };
};
