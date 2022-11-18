export const compareArrays = (arr1: string[], arr2: string[]) => {
  const difference = arr1.filter((x) => !arr2.includes(x)).concat(arr2.filter((x) => !arr1.includes(x)));

  return difference.length === 0;
};

export const compareObjects = (object1: any, object2: any) => {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (var key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if ((isObjects && !compareObjects(value1, value2)) || (!isObjects && value1 !== value2)) {
      return false;
    }
  }
  return true;
};

const isObject = (object: any) => {
  return object != null && typeof object === 'object';
};
