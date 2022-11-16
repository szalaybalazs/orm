export const compareArrays = (arr1: string[], arr2: string[]) => {
  const difference = arr1.filter((x) => !arr2.includes(x)).concat(arr2.filter((x) => !arr1.includes(x)));

  return difference.length === 0;
};
