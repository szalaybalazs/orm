export const debug = (verbose: boolean = false, ...input: any) => {
  if (verbose) console.log(...input);
};

export const formatObject = (input: { [key: string]: any }) => {
  const keys = Object.keys(input);

  const maxLength = Math.max(...keys.map((k) => k.length));
  const lines = keys.map((key) => {
    return `${key.padStart(maxLength + 2, ' ')}: ${input[key]}`;
  });

  return lines.join('\n');
};
