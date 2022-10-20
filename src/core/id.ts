/**
 * Format id to a camel like format
 * @param id input id - can contain special characters and spaces
 * @returns formatted id
 */
export const formatId = (id: string) => {
  return id
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w: string, i: number) => {
      if (i < 1) return w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join('');
};
