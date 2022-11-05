export const editComment = (table: string, column: string, value: string | null) => {
  const val = value ? `'${value.replace(/'/g, '')}'` : 'NULL';
  return `COMMENT ON COLUMN "__SCHEMA__"."${table}"."${column}" IS ${val}`;
};
