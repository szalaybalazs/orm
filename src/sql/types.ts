export const createType = (name: string, values: string[]): string => {
  return `CREATE TYPE ${name} AS ENUM (${values.map((v) => `'${v.replace(/'/g, '')}'`)});`;
};

export const dropType = (name: string): string => {
  return `DROP TYPE IF EXISTS ${name};`;
};
