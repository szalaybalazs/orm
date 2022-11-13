import { writeFile } from 'fs-extra';
import { join } from 'path';

export const writeEntity = async (name: string, directory: string, content: string): Promise<void> => {
  const path = join(directory, `${name}.entity.ts`);
  await writeFile(path, content);
};
