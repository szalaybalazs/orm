/**
 * Format Typescript comment
 * @param comment comment string
 * @returns formatted comment
 */
export const formatComment = (comment?: string) => {
  if (!comment) return '';
  const lines = comment.split('\n').map((l) => `* ${l}`);

  return `/**\n${lines.join('\n')}\n*/\n`;
};
