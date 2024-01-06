import { format } from 'prettier';

export const prettier = (input: string, options: any) => {
  return format(input, options) as unknown as string;
};
