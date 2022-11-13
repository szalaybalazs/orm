import { eExtension } from '../types';

export const createExtension = (extension: eExtension) => {
  const ext = getExtension(extension);
  if (!ext) return '';

  return `CREATE EXTENSION IF NOT EXISTS "${ext}"`;
};
export const dropExtension = (extension: eExtension) => {
  const ext = getExtension(extension);
  if (!ext) return '';

  return `CREATE EXTENSION IF NOT EXISTS "${ext}"`;
};

const getExtension = (extension: eExtension) => {
  if (extension === 'uuid') return 'uuid-ossp';
  if (extension === 'tablefunc') return 'tablefunc';

  return null;
};
