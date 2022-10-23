/**
 * Capitalize and join words to a single string, mainly used for id generation
 * @example "hello world" becomes "HelloWorld"
 * @param input input string to be capitalized
 * @returns string
 */
export const capitalize = (input: string) => {
  const sections = input
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .split(' ');

  return sections
    .map((w) => {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join('');
};
