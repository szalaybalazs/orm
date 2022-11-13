import { pathExistsSync, writeFile } from 'fs-extra';
import { join } from 'path';

export const writeEntity = async (name: string, directory: string, content: string): Promise<string> => {
  const path = join(directory, `${name}.entity.ts`);

  if (pathExistsSync(path)) throw new Error('EXISTS');
  await writeFile(path, content);

  return path;
};
