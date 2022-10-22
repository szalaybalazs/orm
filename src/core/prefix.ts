export const prefix = (input: string, length: number = 0, fill: string = ' ') => {
  const lines = input.split('\n');

  const formatted = lines.map((l) => `${new Array(length).fill(fill).join('')}${l}`);

  return formatted.join('\n');
};
