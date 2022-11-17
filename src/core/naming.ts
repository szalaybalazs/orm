import { eNamingConvention } from '../types/config';

export const camelize = (s: string) => s.replace(/_./g, (x) => x[1].toUpperCase());

export const pascalize = (s: string) => {
  const val = camelize(s);
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const snakelize = (s: string) => {
  const val = s.replace(/[A-Z](.)?/g, (x) => `_${x.toLowerCase()}`);
  return val.replace(/^_/, '');
};

export const convertKey = (key: string, naming?: eNamingConvention) => {
  if (naming === 'CAMEL') return camelize(key);
  else if (naming === 'PASCAL') return pascalize(key);
  else if (naming === 'SNAKE') return snakelize(key);
  else return key;
};

export const snakeToCamel = (
  input: any,
  filter: (e: any) => boolean = () => true,
  replacer: (e: any) => string = (e) => e,
  original: any = {},
) => {
  const obj = Object.entries(input).reduce((acc: any, [key, value]) => {
    if (!filter(key)) return acc;

    acc[camelize(replacer(key))] = value;

    return acc;
  }, original);

  if (Object.keys(obj).length && Object.values(obj).filter(Boolean).length) return obj;
  return null;
};

export const camelToSnake = (
  input: any,
  filter: (e: any) => boolean = () => true,
  replacer: (e: any) => string = (e) => e,
  original: any = {},
) => {
  const obj = Object.entries(input).reduce((acc: any, [key, value]) => {
    if (!filter(key)) return acc;

    acc[snakelize(replacer(key))] = value;

    return acc;
  }, {});

  if (Object.values(obj).some(Boolean)) return { ...original, ...obj };
  return null;
};
