export const debug = (verbose: boolean = false, ...input: any) => {
  if (verbose) console.log(...input);
};
