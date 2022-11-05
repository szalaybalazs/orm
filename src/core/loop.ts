export const loopOver = async <T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
