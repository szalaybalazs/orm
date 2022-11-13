import { isPlural, plural } from 'pluralize';

const typeImport = process.env.NODE_ENV === 'development' ? '../../src/types/entity' : 'undiorm/src/types';
const template = `import { tEntity } from '${typeImport}';

const __NAME__: tEntity = {
  name: '__NAME_PLURAL__',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: true,
    },
  },
};

export default __NAME__;
`;

/**
 * Get empty entity content
 * @param name name of the new entity
 * @returns
 */
export const getEmptyEntityContent = (name: string) => {
  const pluralName = isPlural(name) ? name : plural(name);
  return template.replace(/__NAME__/g, name).replace(/__NAME_PLURAL__/g, pluralName);
};
